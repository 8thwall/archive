import AWS from 'aws-sdk'

const iam = new AWS.IAM()

type Statement = {
  Effect: any
  Resource: any
  Action: any
  Condition: any
}

type AllPermissions = {
  group: Statement[][][]   // Each group has policies, each policy has statements
  attached: Statement[][]  // Each attached policy has statements
  inline: Statement[][]    // Each inline policy has statements
}

const extractStatements = (documentUri: string): Statement[] => {
  const documentText = decodeURIComponent(documentUri)
  const document = JSON.parse(documentText)
  return document.Statement
}

const resolvePolicyPermissions = async (policyArn: string) => {
  const policyRes = await iam.getPolicy({PolicyArn: policyArn}).promise()

  const version = policyRes.Policy?.DefaultVersionId
  if (!version) {
    throw new Error(`Policy ${policyArn} does not have a version`)
  }

  const versionRes = await iam.getPolicyVersion({
    PolicyArn: policyArn,
    VersionId: version,
  }).promise()

  const document = versionRes.PolicyVersion?.Document
  if (!document) {
    throw new Error(`Policy ${policyArn} does not have a document on version: ${version}`)
  }
  return extractStatements(document)
}

const resolvedAttachedPolicies = async (policies: AWS.IAM.attachedPoliciesListType | undefined) => {
  if (!policies) {
    return []
  }

  return Promise.all(policies.map((policy) => {
    if (policy.PolicyArn) {
      return resolvePolicyPermissions(policy.PolicyArn)
    } else {
      throw new Error(`Policy missing ARN on ${policy}`)
    }
  }))
}

const resolveGroupPermissions = async (groupName: string) => {
  const [inlineRes, attachedRes] = await Promise.all([
    iam.listGroupPolicies({GroupName: groupName}).promise(),
    iam.listAttachedGroupPolicies({GroupName: groupName}).promise(),
  ])

  const inlinePolicies = await Promise.all(
    inlineRes.PolicyNames.map(policyName => iam.getGroupPolicy({
      GroupName: groupName,
      PolicyName: policyName,
    }).promise())
  )

  const inline = inlinePolicies.map(e => extractStatements(e.PolicyDocument))

  return inline.concat(await resolvedAttachedPolicies(attachedRes.AttachedPolicies))
}

const resolveUserGroupPermissions = async (userName: string) => {
  const groupsRes = await iam.listGroupsForUser({UserName: userName}).promise()
  return Promise.all(groupsRes.Groups.map(group => resolveGroupPermissions(group.GroupName)))
}

const resolveUserPolicyPermissions = async (userName: string) => {
  const attachedRes = await iam.listAttachedUserPolicies({UserName: userName}).promise()
  return resolvedAttachedPolicies(attachedRes.AttachedPolicies)
}

const resolveUserInlinePermissions = async (userName: string) => {
  const inlineRes = await iam.listUserPolicies({UserName: userName}).promise()
  const policies = await Promise.all(
    inlineRes.PolicyNames.map(e => iam.getUserPolicy({
      UserName: userName,
      PolicyName: e,
    }).promise())
  )
  return policies.map(e => extractStatements(e.PolicyDocument))
}

const resolveUserPermissions = async (userArn: string) => {
  const userName = userArn.substring(userArn.lastIndexOf('/') + 1)
  const [group, attached, inline] = await Promise.all([
    resolveUserGroupPermissions,
    resolveUserPolicyPermissions,
    resolveUserInlinePermissions,
  ].map(e => e(userName)))

  return <AllPermissions>{group, attached, inline}
}

const resolveRolePolicyPermissions = async (roleName: string) => {
  const attachedRes = await iam.listAttachedRolePolicies({RoleName: roleName}).promise()
  return resolvedAttachedPolicies(attachedRes.AttachedPolicies)
}

const resolveRoleInlinePermissions = async (roleName: string) => {
  const inlineRes = await iam.listRolePolicies({RoleName: roleName}).promise()
  const policies = await Promise.all(
    inlineRes.PolicyNames.map(e => iam.getRolePolicy({
      RoleName: roleName,
      PolicyName: e,
    }).promise())
  )
  return policies.map(e => extractStatements(e.PolicyDocument))
}

const resolveRolePermissions = async (roleArn: string) => {
  const roleName = roleArn.substring(roleArn.lastIndexOf('/') + 1)

  const [attached, inline] = await Promise.all([
    resolveRolePolicyPermissions,
    resolveRoleInlinePermissions,
  ].map(e => e(roleName)))

  return <AllPermissions>{attached, inline, group: []}
}

const flat = <T>(a: T[][]): T[] => [].concat(...a)

const resolveAllPermission = async (arn: string) => {
  const perms = await (arn.includes('user/')
    ? resolveUserPermissions(arn)
    : resolveRolePermissions(arn)
  )

  const flatStatements = flat([flat(perms.attached), flat(perms.inline), flat(flat(perms.group))])

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(flatStatements, null, 2))
}

resolveAllPermission(process.argv[2])
