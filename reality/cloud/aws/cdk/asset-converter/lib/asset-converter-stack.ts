import {
  Duration, RemovalPolicy, Stack, StackProps, aws_s3 as S3, aws_dynamodb as DynamoDB,
  aws_lambda_event_sources as lambdaEventSources, aws_logs as Logs, aws_iam as Iam,
} from 'aws-cdk-lib'
import {HttpIamAuthorizer} from 'aws-cdk-lib/aws-apigatewayv2-authorizers'
import {HttpLambdaIntegration} from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import {CfnStage, HttpApi, HttpMethod} from 'aws-cdk-lib/aws-apigatewayv2'
import {Architecture, Runtime, LayerVersion, Code} from 'aws-cdk-lib/aws-lambda'
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import type {Construct} from 'constructs'
import path from 'path'
import {Role} from 'aws-cdk-lib/aws-iam'

const ASSET_PREFIX = 'conversions'
interface AssetConverterStackProps extends StackProps {
  dataRealm: string
  xrhomeRoleName: string
}

export class AssetConverterStack extends Stack {
  constructor(scope: Construct, id: string, props: AssetConverterStackProps) {
    super(scope, id, props)

    const makeNameForEnv = (name: string) => `${name}-${props.dataRealm}`

    // DynamoDB Table
    const ddbTable = new DynamoDB.Table(this, 'asset-converter-requests', {
      tableName: makeNameForEnv('asset-converter-requests'),
      partitionKey: {
        name: 'pk',
        type: DynamoDB.AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: DynamoDB.AttributeType.STRING,
      },
      timeToLiveAttribute: 'expireAt',
    })

    // S3 Bucket
    const assetBucket = new S3.Bucket(this, 'asset-bucket', {
      bucketName: makeNameForEnv('8w-asset-converter-bucket'),
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        // Remove uploads older than 1 day.
        {
          enabled: true,
          expiration: Duration.days(1),
        },
        // Remove incomplete uploads older than 1 day.
        {
          enabled: true,
          abortIncompleteMultipartUploadAfter: Duration.days(1),
        },
      ],
      // Setting up CORS for the bucket
      cors: [{
        allowedMethods: [
          S3.HttpMethods.GET,
          S3.HttpMethods.POST,
          S3.HttpMethods.PUT,
        ],
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
      }],
    })

    // Lambda Functions

    /// URL Signer
    const urlSignerLambda = new NodejsFunction(this, 'asset-converter-url-signer', {
      functionName: makeNameForEnv('asset-converter-url-signer'),
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      handler: 'handler',
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        BUCKET_NAME: assetBucket.bucketName,
        PATH_PREFIX: ASSET_PREFIX,
        TABLE_NAME: ddbTable.tableName,
      },
      timeout: Duration.seconds(10),
      bundling: {
        sourceMap: true,
        sourcesContent: false,
        minify: true,
      },
      memorySize: 1024,
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.RETAIN,
      },
      entry: path.resolve(__dirname, '../src/lambda/url-signer/index.ts'),
    })

    const urlSignerLambdaLiveAlias = urlSignerLambda.addAlias('live')

    assetBucket.grantReadWrite(urlSignerLambda, `${ASSET_PREFIX}/*`)
    ddbTable.grantReadWriteData(urlSignerLambda)

    /// File Converter

    const fbx2GltfLayer = new LayerVersion(this, 'FBX2glTfLayer', {
      code: Code.fromAsset(
        path.resolve(__dirname, '../layer/FBX2glTF-linux-x86_64.zip')
      ),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
      description: 'FBX2glTF binary for converting FBX files to glTF',
    })

    const msdfgenLayer = new LayerVersion(this, 'msdfgenLayer', {
      code: Code.fromAsset(
        path.resolve(__dirname, '../layer/msdfgen.zip')
      ),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
      description: 'msdfgen binary for converting ttf to MTSDF',
    })

    const fileConverterLambda = new NodejsFunction(this, 'asset-converter-file-converter', {
      functionName: makeNameForEnv('asset-converter-file-converter'),
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.X86_64,
      handler: 'handler',
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        BUCKET_NAME: assetBucket.bucketName,
        PATH_PREFIX: ASSET_PREFIX,
        TABLE_NAME: ddbTable.tableName,
      },
      // NOTE (cindyhu): 2048 MB with 300s timeout should be enough for most fbx conversion cases
      timeout: Duration.seconds(300),
      bundling: {
        sourceMap: true,
        sourcesContent: false,
        minify: true,
      },
      memorySize: 2048,
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.RETAIN,
      },
      entry: path.resolve(__dirname, '../src/lambda/file-converter/index.ts'),
      layers: [fbx2GltfLayer, msdfgenLayer],
    })

    assetBucket.grantReadWrite(fileConverterLambda, `${ASSET_PREFIX}/*`)
    ddbTable.grantReadWriteData(fileConverterLambda)

    const assetBucketEventSource = new lambdaEventSources.S3EventSource(assetBucket, {
      events: [
        S3.EventType.OBJECT_CREATED,
      ],
    })

    fileConverterLambda.addEventSource(assetBucketEventSource)

    // API Gateway Permissions
    const xrhomeRole = Role.fromRoleName(this, 'xrhome-role', props.xrhomeRoleName)
    const IamAuthorizer = new HttpIamAuthorizer()

    // API Gateway
    const gatewayApi = new HttpApi(this, makeNameForEnv('asset-converter-api'), {
      defaultAuthorizer: IamAuthorizer,
    })

    // API Gateway Logs
    const apiLogGroup = new Logs.LogGroup(this, makeNameForEnv('asset-converter-api-log-group'), {
      retention: 30,  // Keep logs for 30 days.
    })

    const stage = gatewayApi.defaultStage!.node.defaultChild as CfnStage
    stage.accessLogSettings = {
      destinationArn: apiLogGroup.logGroupArn,
      // copied from public-api-gateway-logs
      format: JSON.stringify({
        requestTime: '$context.requestTime',
        requestId: '$context.requestId',
        httpMethod: '$context.httpMethod',
        path: '$context.path',
        resourcePath: '$context.resourcePath',
        responseLatency: '$context.responseLatency',
        integrationRequestId: '$context.integration.requestId',
        functionResponseStatus: '$context.integration.status',
        integrationLatency: '$context.integration.latency',
        integrationServiceStatus: '$context.integration.integrationStatus',
        integrationErrorMessage: '$context.integration.error',
        authorizerStatus: '$context.authorizer.status',
        authorizerLatency: '$context.authorizer.latency',
        authorizerRequestId: '$context.authorizer.requestId',
        ip: '$context.identity.sourceIp',
        userAgent: '$context.identity.userAgent',
        principalId: '$context.authorizer.principalId',
        authorizerError: '$context.authorizer.error',
        errorType: '$context.error.responseType',
      }),
    }

    apiLogGroup.grantWrite(new Iam.ServicePrincipal('apigateway.amazonaws.com'))

    // API Gateway Integrations
    const integration = new HttpLambdaIntegration(
      makeNameForEnv('asset-converter-api-fn-integration'),
      urlSignerLambdaLiveAlias
    )

    const routes = [{path: '/uploadUrl', methods: [HttpMethod.POST]}]

    const mappedRoutes = routes.flatMap(({methods, path: routePath}) => (
      gatewayApi.addRoutes({
        path: routePath, methods, integration,
      })
    ))

    mappedRoutes.forEach((route) => {
      route.grantInvoke(xrhomeRole)
    })
  }
}
