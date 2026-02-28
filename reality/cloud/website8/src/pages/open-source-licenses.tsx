import React from 'react'
import {createUseStyles} from 'react-jss'
import {graphql} from 'gatsby'

import Layout from '../components/layouts/layout'
import BasicPageHeading from '../components/basic-page-heading'
import {combine} from '../styles/classname-utils'
import {MOBILE_VIEW_OVERRIDE} from '../styles/constants'

const useStyles = createUseStyles({
  indent: {
    marginLeft: '1.5rem',
    marginTop: '1.5rem',
  },
  indentLink: {
    marginLeft: '1.5rem',
    marginTop: '1.5rem',
    marginBottom: '1rem',
  },
  indentRight: {
    marginLeft: '1.5rem',
  },
  spaceBelow: {
    marginBottom: '2rem',
  },
  subSection: {
    fontWeight: '700',
  },
  contact: {
    marginTop: '4rem !important',
    [MOBILE_VIEW_OVERRIDE]: {
      marginTop: '1.5rem !important',
    },
  },
})

export default () => {
  const classes = useStyles()
  return (
    // TODO(kyle): Rename fromNotFoundPage prop for adding noindex to the meta tag
    <Layout fromNotFoundPage title='Open Source Licenses'>
      <BasicPageHeading>Open Source Licenses</BasicPageHeading>
      <section className='light'>
        <div className='row'>
          <div className='col-md-10 max-width mx-auto text8-md'>

            <p>
              8th Wall&#39;s websites and SDKs may incorporate the following open source packages:
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/zxing/zxing'>
                ZXing
              </a>
            </h4>
            <p>
              Copyright 2013 ZXing authors. All Rights Reserved.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/aws/aws-sdk-js'>
                AWS SDK for JavaScript
              </a>
            </h4>

            <p>
              Copyright 2012-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/googlemaps/js-api-loader'>
                Google Maps JavaScript API Loader
              </a>
            </h4>
            <p>
              Copyright 2019 Google LLC. All Rights Reserved.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/microsoft/tslib'>
                Microsoft Runtime Library for TypeScript Helper Functions
              </a>
            </h4>
            <p>
              Copyright (c) Microsoft Corporation.
            </p>

            <p>
              Permission to use, copy, modify, and/or distribute this software for any
              purpose with or without fee is hereby granted.
            </p>

            <p>
              THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
              REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
              AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
              INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
              LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
              OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
              PERFORMANCE OF THIS SOFTWARE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/faisalman/ua-parser-js'>
                UAParser.js
              </a>
            </h4>
            <p>
              Copyright © 2012-2021 Faisal Salman &#60;f&#64;faisalman.com&#62;
            </p>

            <p>
              Licensed under MIT License. Permission is hereby granted, free of charge, to any
              person obtaining a copy of this software and associated documentation files (the
              "Software"), to deal in the Software without restriction, including without
              limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
              and/or sell copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>

            <p>
              The above copyright notice and this permission notice shall be included in all copies
              or substantial portions of the Software.
            </p>

            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
              OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
              SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/google/diff-match-patch'>
                Diff Match and Patch
              </a>
            </h4>
            <p>
              Copyright 2018 The diff-match-patch Authors.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/aws-amplify/amplify-js'>
                Amplify For JavaScript
              </a>
            </h4>
            <p>
              Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/nextapps-de/flexsearch'>
                FlexSearch
              </a>
            </h4>
            <p>
              Copyright 2018-2021 Nextapps GmbH
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/localForage/localForage'>
                localForage
              </a>
            </h4>
            <p>
              Copyright (c) 2013-2016 Mozilla
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/lovell/sharp'>
                sharp
              </a>
            </h4>
            <p>
              Copyright 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022 Lovell Fuller and
              contributors.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/ajaxorg/ace-builds'>
                Ace
              </a>
            </h4>
            <p>
              Copyright (c) 2010, Ajax.org B.V. All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of Ajax.org B.V. nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
              NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
              EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
              SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
              HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
              OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
              SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/d3/d3-ease'>
                d3-ease
              </a>
            </h4>
            <p>
              Copyright 2010-2021 Mike Bostock.
              <br />
              Copyright 2001 Robert Penner.
              <br />
              All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of the author nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/mozilla/source-map'>
                Source Map
              </a>
            </h4>
            <p>
              Copyright (c) 2009-2011, Mozilla Foundation and contributors. All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of the Mozilla Foundation nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/ceres-solver/ceres-solver'>
                Ceres Solver
              </a>
            </h4>
            <p>
              Copyright 2015 Google Inc. All rights reserved.
              <br />
              <a href='http://ceres-solver.org/'>
                http://ceres-solver.org/
              </a>
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of Google Inc., nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/opencv/opencv'>
                OpenCV
              </a>
            </h4>
            <p>
              Copyright (c) 2009, Willow Garage, Inc. All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of the Willow Garage nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/8thwall/tensorflow'>
                TensorFlow
              </a>
            </h4>
            <p>
              Copyright 2017 The TensorFlow Authors. All Rights Reserved.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/google/mediapipe'>
                MediaPipe
              </a>
            </h4>
            <p>
              Copyright 2019 The MediaPipe Authors.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/8thwall/openh264'>
                OpenH264
              </a>
            </h4>
            <p>
              Copyright (c) 2013, Cisco Systems. All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://chromium.googlesource.com/webm/libwebm'>
                WebM
              </a>
            </h4>
            <p>
              Copyright (c) 2010, Google Inc. All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of Google nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://chromium.googlesource.com/webm/libvpx'>
                VPX
              </a>
            </h4>
            <p>
              Copyright (c) 2010, The WebM Project authors. All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of Google, nor the WebM project, nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/xiph/opus'>
                Opus
              </a>
            </h4>
            <p>
              Copyright 2001-2011 Xiph.Org, Skype Limited, Octasic,
              Jean-Marc Valin, Timothy B. Terriberry,
              CSIRO, Gregory Maxwell, Mark Borgerding,
              Erik de Castro Lopo
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of Internet Society, IETF or IETF Trust, nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <p>
              Opus is subject to the royalty-free patent licenses which are specified at:
            </p>

            <p>
              Xiph.Org Foundation:{' '}
              <a href='https://datatracker.ietf.org/ipr/1524/'>
                https://datatracker.ietf.org/ipr/1523/
              </a>
            </p>

            <p>
              Microsoft Corporation:{' '}
              <a href='https://datatracker.ietf.org/ipr/1914/'>
                https://datatracker.ietf.org/ipr/1914/
              </a>
            </p>

            <p>
              BroadcomCorporation:{' '}
              <a href='https://datatracker.ietf.org/ipr/1526/'>
                https://datatracker.ietf.org/ipr/1526/
              </a>
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/mstorsjo/fdk-aac'>
                FDK AAC
              </a>
            </h4>
            <p>
              Software License for The Fraunhofer FDK AAC Codec Library for Android
            </p>
            <p>
              © Copyright  1995 - 2018 Fraunhofer-Gesellschaft zur Förderung der angewandten
              Forschung e.V. All rights reserved.
            </p>

            <span className={classes.subSection}>1. INTRODUCTION</span>
            <p>
              The Fraunhofer FDK AAC Codec Library for Android (&#34;FDK AAC Codec&#34;) is software
              that implements the MPEG Advanced Audio Coding (&#34;AAC&#34;) encoding and decoding
              scheme for digital audio. This FDK AAC Codec software is intended to be used on
              a wide variety of Android devices.
            </p>
            <p>
              AAC&#39;s HE-AAC and HE-AAC v2 versions are regarded as today&#39;s most efficient
              general perceptual audio codecs. AAC-ELD is considered the best-performing
              full-bandwidth communications codec by independent studies and is widely
              deployed. AAC has been standardized by ISO and IEC as part of the MPEG
              specifications.
            </p>
            <p>
              Patent licenses for necessary patent claims for the FDK AAC Codec (including
              those of Fraunhofer) may be obtained through Via Licensing
              (www.vialicensing.com) or through the respective patent owners individually for
              the purpose of encoding or decoding bit streams in products that are compliant
              with the ISO/IEC MPEG audio standards. Please note that most manufacturers of
              Android devices already license these patent claims through Via Licensing or
              directly from the patent owners, and therefore FDK AAC Codec software may
              already be covered under those patent licenses when it is used for those
              licensed purposes only.
            </p>
            <p>
              Commercially-licensed AAC software libraries, including floating-point versions
              with enhanced sound quality, are also available from Fraunhofer. Users are
              encouraged to check the Fraunhofer website for additional applications
              information and documentation.
            </p>
            <span className={classes.subSection}>2. COPYRIGHT LICENSE</span>
            <p>
              Redistribution and use in source and binary forms, with or without modification,
              are permitted without payment of copyright license fees provided that you
              satisfy the following conditions:
            </p>
            <p>
              You must retain the complete text of this software license in redistributions of
              the FDK AAC Codec or your modifications thereto in source code form
            </p>
            <p>
              You must retain the complete text of this software license in the documentation
              and/or other materials provided with redistributions of the FDK AAC Codec or
              your modifications thereto in binary form. You must make available free of
              charge copies of the complete source code of the FDK AAC Codec and your
              modifications thereto to recipients of copies in binary form.
            </p>
            <p>
              The name of Fraunhofer may not be used to endorse or promote products derived
              from this library without prior written permission.
            </p>
            <p>
              You may not charge copyright license fees for anyone to use, copy or distribute
              the FDK AAC Codec software or your modifications thereto.
            </p>
            <p>
              Your modified versions of the FDK AAC Codec must carry prominent notices stating
              that you changed the software and the date of any change. For modified versions
              of the FDK AAC Codec, the term &#34;Fraunhofer FDK AAC Codec Library for Android&#34;
              must be replaced by the term &#34;Third-Party Modified Version of the Fraunhofer FDK
              AAC Codec Library for Android.&#34;
            </p>
            <span className={classes.subSection}>3. NO PATENT LICENSE</span>
            <p>
              NO EXPRESS OR IMPLIED LICENSES TO ANY PATENT CLAIMS, including without
              limitation the patents of Fraunhofer, ARE GRANTED BY THIS SOFTWARE LICENSE.
              Fraunhofer provides no warranty of patent non-infringement with respect to this
              software.
            </p>
            <p>
              You may use this FDK AAC Codec software or modifications thereto only for
              purposes that are authorized by appropriate patent licenses.
            </p>
            <span className={classes.subSection}>4. DISCLAIMER</span>
            <p>
              This FDK AAC Codec software is provided by Fraunhofer on behalf of the copyright
              holders and contributors &#34;AS IS&#34; and WITHOUT ANY EXPRESS OR IMPLIED
              WARRANTIES, including but not limited to the implied warranties of merchantability and
              fitness for a particular purpose. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
              CONTRIBUTORS BE LIABLE for any direct, indirect, incidental, special, exemplary,
              or consequential damages, including but not limited to procurement of substitute
              goods or services; loss of use, data, or profits, or business interruption,
              however caused and on any theory of liability, whether in contract, strict
              liability, or tort (including negligence), arising in any way out of the use of
              this software, even if advised of the possibility of such damage.
            </p>
            <span className={classes.subSection}>5. CONTACT INFORMATION</span>
            <p>
              Fraunhofer Institute for Integrated Circuits IIS
              <br />
              Attention: Audio and Multimedia Departments - FDK AAC LL
              <br />
              Am Wolfsmantel 33
              <br />
              91058 Erlangen, Germany
            </p>
            <p>
              www.iis.fraunhofer.de/amm
              <br />
              amm-info@iis.fraunhofer.de
            </p>

            <h4 className='font8-black'>
              <a href='http://www.netlib.org/clapack/'>
                clapack
              </a>
            </h4>
            <p>
              Copyright (c) 1992-2008 The University of Tennessee.  All rights reserved.
            </p>

            <p>
              Additional copyrights may follow.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                Neither the name of the copyright holders nor the
                names of its contributors may be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/8thwall/libmp4v2'>
                mp4v2
              </a>
            </h4>

            <p className={combine('text-center', classes.spaceBelow)}>
              MOZILLA PUBLIC LICENSE
              <br />
              Version 1.1
            </p>

            <hr />

            <span className={classes.subSection}>1. Definitions</span>

            <p className={classes.indent}>
              1.0.1. &#34;Commercial Use&#34; means distribution or otherwise making the
              Covered Code available to a third party.
            </p>

            <p className={classes.indent}>
              1.1. &#34;Contributor&#34; means each entity that creates or contributes to
              the creation of Modifications.
            </p>

            <p className={classes.indent}>
              1.2. &#34;Contributor Version&#34; means the combination of the Original
              Code, prior Modifications used by a Contributor, and the Modifications
              made by that particular Contributor.
            </p>

            <p className={classes.indent}>
              1.3. &#34;Covered Code&#34; means the Original Code or Modifications or the
              combination of the Original Code and Modifications, in each case
              including portions thereof.
            </p>

            <p className={classes.indent}>
              1.4. &#34;Electronic Distribution Mechanism&#34; means a mechanism generally
              accepted in the software development community for the electronic
              transfer of data.
            </p>

            <p className={classes.indent}>
              1.5. &#34;Executable&#34; means Covered Code in any form other than Source
              Code.
            </p>

            <p className={classes.indent}>
              1.6. &#34;Initial Developer&#34; means the individual or entity identified
              as the Initial Developer in the Source Code notice required by Exhibit
              A.
            </p>

            <p className={classes.indent}>
              1.7. &#34;Larger Work&#34; means a work which combines Covered Code or
              portions thereof with code not governed by the terms of this License.
            </p>

            <p className={classes.indent}>
              1.8. &#34;License&#34; means this document.
            </p>

            <p className={classes.indent}>
              1.8.1. &#34;Licensable&#34; means having the right to grant, to the maximum
              extent possible, whether at the time of the initial grant or
              subsequently acquired, any and all of the rights conveyed herein.
            </p>

            <p className={classes.indent}>
              1.9. &#34;Modifications&#34; means any addition to or deletion from the
              substance or structure of either the Original Code or any previous
              Modifications. When Covered Code is released as a series of files, a
              Modification is:
              <p className={classes.indent}>
                A. Any addition to or deletion from the contents of a file
                containing Original Code or previous Modifications.
              </p>

              <p className={classes.indent}>
                B. Any new file that contains any part of the Original Code or
                previous Modifications.
              </p>
            </p>

            <p className={classes.indent}>
              1.10. &#34;Original Code&#34; means Source Code of computer software code
              which is described in the Source Code notice required by Exhibit A as
              Original Code, and which, at the time of its release under this
              License is not already Covered Code governed by this License.
            </p>

            <p className={classes.indent}>
              1.10.1. &#34;Patent Claims&#34; means any patent claim(s), now owned or
              hereafter acquired, including without limitation,  method, process,
              and apparatus claims, in any patent Licensable by grantor.
            </p>

            <p className={classes.indent}>
              1.11. &#34;Source Code&#34; means the preferred form of the Covered Code for
              making modifications to it, including all modules it contains, plus
              any associated interface definition files, scripts used to control
              compilation and installation of an Executable, or source code
              differential comparisons against either the Original Code or another
              well known, available Covered Code of the Contributor&#39;s choice. The
              Source Code can be in a compressed or archival form, provided the
              appropriate decompression or de-archiving software is widely available
              for no charge.
            </p>

            <p className={classes.indent}>
              1.12. &#34;You&#34; (or &#34;Your&#34;) means an individual or a legal entity
              exercising rights under, and complying with all of the terms of, this
              License or a future version of this License issued under Section 6.1.
              For legal entities, &#34;You&#34; includes any entity which controls, is
              controlled by, or is under common control with You. For purposes of
              this definition, &#34;control&#34; means (a) the power, direct or indirect,
              to cause the direction or management of such entity, whether by
              contract or otherwise, or (b) ownership of more than fifty percent
              (50%) of the outstanding shares or beneficial ownership of such
              entity.
            </p>

            <span className={classes.subSection}>2. Source Code License.</span>

            <p className={classes.indent}>
              2.1. The Initial Developer Grant.
              <br />
              The Initial Developer hereby grants You a world-wide, royalty-free,
              non-exclusive license, subject to third party intellectual property
              claims:
              <p className={classes.indent}>
                (a) under intellectual property rights (other than patent or
                trademark) Licensable by Initial Developer to use, reproduce,
                modify, display, perform, sublicense and distribute the Original
                Code (or portions thereof) with or without Modifications, and/or
                as part of a Larger Work; and
              </p>

              <p className={classes.indent}>
                (b) under Patents Claims infringed by the making, using or
                selling of Original Code, to make, have made, use, practice,
                sell, and offer for sale, and/or otherwise dispose of the
                Original Code (or portions thereof).
              </p>

              <p className={classes.indent}>
                (c) the licenses granted in this Section 2.1(a) and (b) are
                effective on the date Initial Developer first distributes
                Original Code under the terms of this License.
              </p>

              <p className={classes.indent}>
                (d) Notwithstanding Section 2.1(b) above, no patent license is
                granted: 1) for code that You delete from the Original Code; 2)
                separate from the Original Code;  or 3) for infringements caused
                by: i) the modification of the Original Code or ii) the
                combination of the Original Code with other software or devices.
              </p>
            </p>

            <p className={classes.indent}>
              2.2. Contributor Grant.
              <br />
              Subject to third party intellectual property claims, each Contributor
              hereby grants You a world-wide, royalty-free, non-exclusive license

              <p className={classes.indent}>
                (a)  under intellectual property rights (other than patent or
                trademark) Licensable by Contributor, to use, reproduce, modify,
                display, perform, sublicense and distribute the Modifications
                created by such Contributor (or portions thereof) either on an
                unmodified basis, with other Modifications, as Covered Code
                and/or as part of a Larger Work; and
              </p>

              <p className={classes.indent}>
                (b) under Patent Claims infringed by the making, using, or
                selling of  Modifications made by that Contributor either alone
                and/or in combination with its Contributor Version (or portions
                of such combination), to make, use, sell, offer for sale, have
                made, and/or otherwise dispose of: 1) Modifications made by that
                Contributor (or portions thereof); and 2) the combination of
                Modifications made by that Contributor with its Contributor
                Version (or portions of such combination).
              </p>

              <p className={classes.indent}>
                (c) the licenses granted in Sections 2.2(a) and 2.2(b) are
                effective on the date Contributor first makes Commercial Use of
                the Covered Code.
              </p>

              <p className={classes.indent}>
                (d)    Notwithstanding Section 2.2(b) above, no patent license is
                granted: 1) for any code that Contributor has deleted from the
                Contributor Version; 2)  separate from the Contributor Version;
                3)  for infringements caused by: i) third party modifications of
                Contributor Version or ii)  the combination of Modifications made
                by that Contributor with other software  (except as part of the
                Contributor Version) or other devices; or 4) under Patent Claims
                infringed by Covered Code in the absence of Modifications made by
                that Contributor.
              </p>
            </p>

            <span className={classes.subSection}>3. Distribution Obligations.</span>

            <p className={classes.indent}>
              3.1. Application of License.
              <br />
              The Modifications which You create or to which You contribute are
              governed by the terms of this License, including without limitation
              Section 2.2. The Source Code version of Covered Code may be
              distributed only under the terms of this License or a future version
              of this License released under Section 6.1, and You must include a
              copy of this License with every copy of the Source Code You
              distribute. You may not offer or impose any terms on any Source Code
              version that alters or restricts the applicable version of this
              License or the recipients&#39; rights hereunder. However, You may include
              an additional document offering the additional rights described in
              Section 3.5.
            </p>

            <p className={classes.indent}>
              3.2. Availability of Source Code.
              <br />
              Any Modification which You create or to which You contribute must be
              made available in Source Code form under the terms of this License
              either on the same media as an Executable version or via an accepted
              Electronic Distribution Mechanism to anyone to whom you made an
              Executable version available; and if made available via Electronic
              Distribution Mechanism, must remain available for at least twelve (12)
              months after the date it initially became available, or at least six
              (6) months after a subsequent version of that particular Modification
              has been made available to such recipients. You are responsible for
              ensuring that the Source Code version remains available even if the
              Electronic Distribution Mechanism is maintained by a third party.
            </p>

            <p className={classes.indent}>
              3.3. Description of Modifications.
              <br />
              You must cause all Covered Code to which You contribute to contain a
              file documenting the changes You made to create that Covered Code and
              the date of any change. You must include a prominent statement that
              the Modification is derived, directly or indirectly, from Original
              Code provided by the Initial Developer and including the name of the
              Initial Developer in (a) the Source Code, and (b) in any notice in an
              Executable version or related documentation in which You describe the
              origin or ownership of the Covered Code.
            </p>

            <p className={classes.indent}>
              3.4. Intellectual Property Matters
              <p className={classes.indent}>
                (a) Third Party Claims.
                <br />
                If Contributor has knowledge that a license under a third party&#39;s
                intellectual property rights is required to exercise the rights
                granted by such Contributor under Sections 2.1 or 2.2,
                Contributor must include a text file with the Source Code
                distribution titled &#34;LEGAL&#34; which describes the claim and the
                party making the claim in sufficient detail that a recipient will
                know whom to contact. If Contributor obtains such knowledge after
                the Modification is made available as described in Section 3.2,
                Contributor shall promptly modify the LEGAL file in all copies
                Contributor makes available thereafter and shall take other steps
                (such as notifying appropriate mailing lists or newsgroups)
                reasonably calculated to inform those who received the Covered
                Code that new knowledge has been obtained.
              </p>

              <p className={classes.indent}>
                (b) Contributor APIs.
                <br />
                If Contributor&#39;s Modifications include an application programming
                interface and Contributor has knowledge of patent licenses which
                are reasonably necessary to implement that API, Contributor must
                also include this information in the LEGAL file.
              </p>

              <p className={classes.indent}>
                (c) Representations.
                <br />
                Contributor represents that, except as disclosed pursuant to
                Section 3.4(a) above, Contributor believes that Contributor&#39;s
                Modifications are Contributor&#39;s original creation(s) and/or
                Contributor has sufficient rights to grant the rights conveyed by
                this License.
              </p>
            </p>

            <p className={classes.indent}>
              3.5. Required Notices.
              <br />
              You must duplicate the notice in Exhibit A in each file of the Source
              Code.  If it is not possible to put such notice in a particular Source
              Code file due to its structure, then You must include such notice in a
              location (such as a relevant directory) where a user would be likely
              to look for such a notice.  If You created one or more Modification(s)
              You may add your name as a Contributor to the notice described in
              Exhibit A.  You must also duplicate this License in any documentation
              for the Source Code where You describe recipients&#39; rights or ownership
              rights relating to Covered Code.  You may choose to offer, and to
              charge a fee for, warranty, support, indemnity or liability
              obligations to one or more recipients of Covered Code. However, You
              may do so only on Your own behalf, and not on behalf of the Initial
              Developer or any Contributor. You must make it absolutely clear than
              any such warranty, support, indemnity or liability obligation is
              offered by You alone, and You hereby agree to indemnify the Initial
              Developer and every Contributor for any liability incurred by the
              Initial Developer or such Contributor as a result of warranty,
              support, indemnity or liability terms You offer.
            </p>

            <p className={classes.indent}>
              3.6. Distribution of Executable Versions.
              <br />
              You may distribute Covered Code in Executable form only if the
              requirements of Section 3.1-3.5 have been met for that Covered Code,
              and if You include a notice stating that the Source Code version of
              the Covered Code is available under the terms of this License,
              including a description of how and where You have fulfilled the
              obligations of Section 3.2. The notice must be conspicuously included
              in any notice in an Executable version, related documentation or
              collateral in which You describe recipients&#39; rights relating to the
              Covered Code. You may distribute the Executable version of Covered
              Code or ownership rights under a license of Your choice, which may
              contain terms different from this License, provided that You are in
              compliance with the terms of this License and that the license for the
              Executable version does not attempt to limit or alter the recipient&#39;s
              rights in the Source Code version from the rights set forth in this
              License. If You distribute the Executable version under a different
              license You must make it absolutely clear that any terms which differ
              from this License are offered by You alone, not by the Initial
              Developer or any Contributor. You hereby agree to indemnify the
              Initial Developer and every Contributor for any liability incurred by
              the Initial Developer or such Contributor as a result of any such
              terms You offer.
            </p>

            <p className={classes.indent}>
              3.7. Larger Works.
              <br />
              You may create a Larger Work by combining Covered Code with other code
              not governed by the terms of this License and distribute the Larger
              Work as a single product. In such a case, You must make sure the
              requirements of this License are fulfilled for the Covered Code.
            </p>

            <p className={classes.indent}>
              4. Inability to Comply Due to Statute or Regulation.
              <br />
              If it is impossible for You to comply with any of the terms of this
              License with respect to some or all of the Covered Code due to
              statute, judicial order, or regulation then You must: (a) comply with
              the terms of this License to the maximum extent possible; and (b)
              describe the limitations and the code they affect. Such description
              must be included in the LEGAL file described in Section 3.4 and must
              be included with all distributions of the Source Code. Except to the
              extent prohibited by statute or regulation, such description must be
              sufficiently detailed for a recipient of ordinary skill to be able to
              understand it.
            </p>

            <p className={classes.indent}>
              5. Application of this License.
              <br />
              This License applies to code to which the Initial Developer has
              attached the notice in Exhibit A and to related Covered Code.
            </p>

            <p className={classes.indent}>
              6. Versions of the License.

              <p className={classes.indent}>
                6.1. New Versions.
                <br />
                Netscape Communications Corporation (&#34;Netscape&#34;) may publish revised
                and/or new versions of the License from time to time. Each version
                will be given a distinguishing version number.
              </p>

              <p className={classes.indent}>
                6.2. Effect of New Versions.
                <br />
                Once Covered Code has been published under a particular version of the
                License, You may always continue to use it under the terms of that
                version. You may also choose to use such Covered Code under the terms
                of any subsequent version of the License published by Netscape. No one
                other than Netscape has the right to modify the terms applicable to
                Covered Code created under this License.
              </p>

              <p className={classes.indent}>
                6.3. Derivative Works.
                <br />
                If You create or use a modified version of this License (which you may
                only do in order to apply it to code which is not already Covered Code
                governed by this License), You must (a) rename Your license so that
                the phrases &#34;Mozilla&#34;, &#34;MOZILLAPL&#34;, &#34;MOZPL&#34;,
                &#34;Netscape&#34;,
                &#34;MPL&#34;, &#34;NPL&#34; or any confusingly similar phrase do not appear in your
                license (except to note that your license differs from this License)
                and (b) otherwise make it clear that Your version of the license
                contains terms which differ from the Mozilla Public License and
                Netscape Public License. (Filling in the name of the Initial
                Developer, Original Code or Contributor in the notice described in
                Exhibit A shall not of themselves be deemed to be modifications of
                this License.)
              </p>
            </p>

            <span className={classes.subSection}>7. DISCLAIMER OF WARRANTY.</span>

            <p className={classes.indent}>
              COVERED CODE IS PROVIDED UNDER THIS LICENSE ON AN &#34;AS IS&#34; BASIS,
              WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING,
              WITHOUT LIMITATION, WARRANTIES THAT THE COVERED CODE IS FREE OF
              DEFECTS, MERCHANTABLE, FIT FOR A PARTICULAR PURPOSE OR NON-INFRINGING.
              THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE COVERED CODE
              IS WITH YOU. SHOULD ANY COVERED CODE PROVE DEFECTIVE IN ANY RESPECT,
              YOU (NOT THE INITIAL DEVELOPER OR ANY OTHER CONTRIBUTOR) ASSUME THE
              COST OF ANY NECESSARY SERVICING, REPAIR OR CORRECTION. THIS DISCLAIMER
              OF WARRANTY CONSTITUTES AN ESSENTIAL PART OF THIS LICENSE. NO USE OF
              ANY COVERED CODE IS AUTHORIZED HEREUNDER EXCEPT UNDER THIS DISCLAIMER.
            </p>

            <span className={classes.subSection}>8. TERMINATION.</span>

            <p className={classes.indent}>
              8.1.  This License and the rights granted hereunder will terminate
              automatically if You fail to comply with terms herein and fail to cure
              such breach within 30 days of becoming aware of the breach. All
              sublicenses to the Covered Code which are properly granted shall
              survive any termination of this License. Provisions which, by their
              nature, must remain in effect beyond the termination of this License
              shall survive.
            </p>

            <p className={classes.indent}>
              8.2.  If You initiate litigation by asserting a patent infringement
              claim (excluding declatory judgment actions) against Initial Developer
              or a Contributor (the Initial Developer or Contributor against whom
              You file such action is referred to as &#34;Participant&#34;)  alleging that:

              <p className={classes.indent}>
                (a)  such Participant&#39;s Contributor Version directly or indirectly
                infringes any patent, then any and all rights granted by such
                Participant to You under Sections 2.1 and/or 2.2 of this License
                shall, upon 60 days notice from Participant terminate prospectively,
                unless if within 60 days after receipt of notice You either: (i)
                agree in writing to pay Participant a mutually agreeable reasonable
                royalty for Your past and future use of Modifications made by such
                Participant, or (ii) withdraw Your litigation claim with respect to
                the Contributor Version against such Participant.  If within 60 days
                of notice, a reasonable royalty and payment arrangement are not
                mutually agreed upon in writing by the parties or the litigation claim
                is not withdrawn, the rights granted by Participant to You under
                Sections 2.1 and/or 2.2 automatically terminate at the expiration of
                the 60 day notice period specified above.
              </p>

              <p className={classes.indent}>
                (b)  any software, hardware, or device, other than such Participant&#39;s
                Contributor Version, directly or indirectly infringes any patent, then
                any rights granted to You by such Participant under Sections 2.1(b)
                and 2.2(b) are revoked effective as of the date You first made, used,
                sold, distributed, or had made, Modifications made by that
                Participant.
              </p>
            </p>

            <p className={classes.indent}>
              8.3.  If You assert a patent infringement claim against Participant
              alleging that such Participant&#39;s Contributor Version directly or
              indirectly infringes any patent where such claim is resolved (such as
              by license or settlement) prior to the initiation of patent
              infringement litigation, then the reasonable value of the licenses
              granted by such Participant under Sections 2.1 or 2.2 shall be taken
              into account in determining the amount or value of any payment or
              license.
            </p>

            <p className={classes.indent}>
              8.4.  In the event of termination under Sections 8.1 or 8.2 above,
              all end user license agreements (excluding distributors and resellers)
              which have been validly granted by You or any distributor hereunder
              prior to termination shall survive termination.
            </p>

            <span className={classes.subSection}>9. LIMITATION OF LIABILITY.</span>

            <p className={classes.indent}>
              UNDER NO CIRCUMSTANCES AND UNDER NO LEGAL THEORY, WHETHER TORT
              (INCLUDING NEGLIGENCE), CONTRACT, OR OTHERWISE, SHALL YOU, THE INITIAL
              DEVELOPER, ANY OTHER CONTRIBUTOR, OR ANY DISTRIBUTOR OF COVERED CODE,
              OR ANY SUPPLIER OF ANY OF SUCH PARTIES, BE LIABLE TO ANY PERSON FOR
              ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY
              CHARACTER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF GOODWILL,
              WORK STOPPAGE, COMPUTER FAILURE OR MALFUNCTION, OR ANY AND ALL OTHER
              COMMERCIAL DAMAGES OR LOSSES, EVEN IF SUCH PARTY SHALL HAVE BEEN
              INFORMED OF THE POSSIBILITY OF SUCH DAMAGES. THIS LIMITATION OF
              LIABILITY SHALL NOT APPLY TO LIABILITY FOR DEATH OR PERSONAL INJURY
              RESULTING FROM SUCH PARTY&#39;S NEGLIGENCE TO THE EXTENT APPLICABLE LAW
              PROHIBITS SUCH LIMITATION. SOME JURISDICTIONS DO NOT ALLOW THE
              EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO
              THIS EXCLUSION AND LIMITATION MAY NOT APPLY TO YOU.
            </p>

            <span className={classes.subSection}>10. U.S. GOVERNMENT END USERS.</span>

            <p className={classes.indent}>
              The Covered Code is a &#34;commercial item,&#34; as that term is defined in
              48 C.F.R. 2.101 (Oct. 1995), consisting of &#34;commercial computer
              software&#34; and &#34;commercial computer software documentation,&#34; as such
              terms are used in 48 C.F.R. 12.212 (Sept. 1995). Consistent with 48
              C.F.R. 12.212 and 48 C.F.R. 227.7202-1 through 227.7202-4 (June 1995),
              all U.S. Government End Users acquire Covered Code with only those
              rights set forth herein.
            </p>

            <span className={classes.subSection}>
              11. MISCELLANEOUS.
            </span>

            <p className={classes.indent}>
              This License represents the complete agreement concerning subject
              matter hereof. If any provision of this License is held to be
              unenforceable, such provision shall be reformed only to the extent
              necessary to make it enforceable. This License shall be governed by
              California law provisions (except to the extent applicable law, if
              any, provides otherwise), excluding its conflict-of-law provisions.
              With respect to disputes in which at least one party is a citizen of,
              or an entity chartered or registered to do business in the United
              States of America, any litigation relating to this License shall be
              subject to the jurisdiction of the Federal Courts of the Northern
              District of California, with venue lying in Santa Clara County,
              California, with the losing party responsible for costs, including
              without limitation, court costs and reasonable attorneys&#39; fees and
              expenses. The application of the United Nations Convention on
              Contracts for the International Sale of Goods is expressly excluded.
              Any law or regulation which provides that the language of a contract
              shall be construed against the drafter shall not apply to this
              License.
            </p>

            <span className={classes.subSection}>
              12. RESPONSIBILITY FOR CLAIMS.
            </span>

            <p className={classes.indent}>
              As between Initial Developer and the Contributors, each party is
              responsible for claims and damages arising, directly or indirectly,
              out of its utilization of rights under this License and You agree to
              work with Initial Developer and Contributors to distribute such
              responsibility on an equitable basis. Nothing herein is intended or
              shall be deemed to constitute any admission of liability.
            </p>

            <span className={classes.subSection}>
              13. MULTIPLE-LICENSED CODE.
            </span>

            <p className={classes.indent}>
              Initial Developer may designate portions of the Covered Code as
              &#34;Multiple-Licensed&#34;.  &#34;Multiple-Licensed&#34; means that the Initial
              Developer permits you to utilize portions of the Covered Code under
              Your choice of the NPL or the alternative licenses, if any, specified
              by the Initial Developer in the file described in Exhibit A.
            </p>

            <span className={classes.subSection}>
              EXHIBIT A -Mozilla Public License.
            </span>

            <p className={classes.indent}>
              The contents of this file are subject to the Mozilla Public License
              Version 1.1 (the &#34;License&#34;); you may not use this file except in
              compliance with the License. You may obtain a copy of the License at{' '}
              <a href='http://www.mozilla.org/MPL/'>http://www.mozilla.org/MPL/</a>
            </p>

            <p className={classes.indent}>
              Software distributed under the License is distributed on an &#34;AS IS&#34;
              basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
              License for the specific language governing rights and limitations
              under the License.
            </p>

            <p className={classes.indent}>
              The Original Code is MPEG4IP.
            </p>

            <p className={classes.indent}>
              The Initial Developer of the Original Code is Cisco Systems Inc.
              Portions created by Cisco Systems Inc are
              Copyright (C) Cisco Systems Inc. 2001. All Rights Reserved.
            </p>

            <p className={classes.indent}>
              Contributor(s): ...
            </p>

            <p className={classes.indent}>
              [NOTE: The text of this Exhibit A may differ slightly from the text of
              the notices in the Source Code files of the Original Code. You should
              use the text of this Exhibit A rather than the text found in the
              Original Code Source Code for Your Modifications.]
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/8thwall/eigen'>
                Eigen
              </a>
            </h4>

            <p className={combine('text-center', classes.spaceBelow)}>
              Mozilla Public License Version 2.0
            </p>

            <hr />

            <span className={classes.subSection}>1. Definitions</span>
            <p className={classes.indent}>
              1.1. &#34;Contributor&#34;
              means each individual or legal entity that creates, contributes to
              the creation of, or owns Covered Software.
            </p>

            <p className={classes.indent}>
              1.2. &#34;Contributor Version&#34;
              means the combination of the Contributions of others (if any) used
              by a Contributor and that particular Contributor&#39;s Contribution.
            </p>

            <p className={classes.indent}>
              1.3. &#34;Contribution&#34;
              means Covered Software of a particular Contributor.
            </p>

            <p className={classes.indent}>
              1.4. &#34;Covered Software&#34;
              means Source Code Form to which the initial Contributor has attached
              the notice in Exhibit A, the Executable Form of such Source Code
              Form, and Modifications of such Source Code Form, in each case
              including portions thereof.
            </p>

            <p className={classes.indent}>
              1.5. &#34;Incompatible With Secondary Licenses&#34;
              means

              <p className={classes.indent}>
                (a) that the initial Contributor has attached the notice described
                in Exhibit B to the Covered Software; or
              </p>

              <p className={classes.indent}>
                (b) that the Covered Software was made available under the terms of
                version 1.1 or earlier of the License, but not also under the
                terms of a Secondary License.
              </p>
            </p>

            <p className={classes.indent}>
              1.6. &#34;Executable Form&#34;
              means any form of the work other than Source Code Form.
            </p>

            <p className={classes.indent}>
              1.7. &#34;Larger Work&#34;
              means a work that combines Covered Software with other material, in
              a separate file or files, that is not Covered Software.
            </p>

            <p className={classes.indent}>
              1.8. &#34;License&#34;
              means this document.
            </p>

            <p className={classes.indent}>
              1.9. &#34;Licensable&#34;
              means having the right to grant, to the maximum extent possible,
              whether at the time of the initial grant or subsequently, any and
              all of the rights conveyed by this License.
            </p>

            <p className={classes.indent}>
              1.10. &#34;Modifications&#34;
              means any of the following:

              <p className={classes.indent}>
                (a) any file in Source Code Form that results from an addition to,
                deletion from, or modification of the contents of Covered
                Software; or
              </p>

              <p className={classes.indent}>
                (b) any new file in Source Code Form that contains any Covered
                Software.
              </p>
            </p>

            <p className={classes.indent}>
              1.11. &#34;Patent Claims&#34; of a Contributor
              means any patent claim(s), including without limitation, method,
              process, and apparatus claims, in any patent Licensable by such
              Contributor that would be infringed, but for the grant of the
              License, by the making, using, selling, offering for sale, having
              made, import, or transfer of either its Contributions or its
              Contributor Version.
            </p>

            <p className={classes.indent}>
              1.12. &#34;Secondary License&#34;
              means either the GNU General Public License, Version 2.0, the GNU
              Lesser General Public License, Version 2.1, the GNU Affero General
              Public License, Version 3.0, or any later versions of those
              licenses.
            </p>

            <p className={classes.indent}>
              1.13. &#34;Source Code Form&#34;
              means the form of the work preferred for making modifications.
            </p>

            <p className={classes.indent}>
              1.14. &#34;You&#34; (or &#34;Your&#34;)
              means an individual or a legal entity exercising rights under this
              License. For legal entities, &#34;You&#34; includes any entity that
              controls, is controlled by, or is under common control with You. For
              purposes of this definition, &#34;control&#34; means (a) the power, direct
              or indirect, to cause the direction or management of such entity,
              whether by contract or otherwise, or (b) ownership of more than
              fifty percent (50%) of the outstanding shares or beneficial
              ownership of such entity.
            </p>

            <span className={classes.subSection}>
              2. License Grants and Conditions
            </span>

            <p className={classes.indent}>
              2.1. Grants
              <br />
              Each Contributor hereby grants You a world-wide, royalty-free,
              non-exclusive license:

              <p className={classes.indent}>
                (a) under intellectual property rights (other than patent or trademark)
                Licensable by such Contributor to use, reproduce, make available,
                modify, display, perform, distribute, and otherwise exploit its
                Contributions, either on an unmodified basis, with Modifications, or
                as part of a Larger Work; and
              </p>

              <p className={classes.indent}>
                (b) under Patent Claims of such Contributor to make, use, sell, offer
                for sale, have made, import, and otherwise transfer either its
                Contributions or its Contributor Version.
              </p>
            </p>

            <p className={classes.indent}>
              2.2. Effective Date
              <br />
              The licenses granted in Section 2.1 with respect to any Contribution
              become effective for each Contribution on the date the Contributor first
              distributes such Contribution.
            </p>

            <p className={classes.indent}>
              2.3. Limitations on Grant Scope
              <br />
              The licenses granted in this Section 2 are the only rights granted under
              this License. No additional rights or licenses will be implied from the
              distribution or licensing of Covered Software under this License.
              Notwithstanding Section 2.1(b) above, no patent license is granted by a
              Contributor:

              <p className={classes.indent}>
                (a) for any code that a Contributor has removed from Covered Software;
                or
              </p>

              <p className={classes.indent}>
                (b) for infringements caused by: (i) Your and any other third party&#39;s
                modifications of Covered Software, or (ii) the combination of its
                Contributions with other software (except as part of its Contributor
                Version); or
              </p>

              <p className={classes.indent}>
                (c) under Patent Claims infringed by Covered Software in the absence of
                its Contributions.
              </p>

              <p className={classes.indent}>
                This License does not grant any rights in the trademarks, service marks,
                or logos of any Contributor (except as may be necessary to comply with
                the notice requirements in Section 3.4).
              </p>
            </p>

            <p className={classes.indent}>
              2.4. Subsequent Licenses
              <br />
              No Contributor makes additional grants as a result of Your choice to
              distribute the Covered Software under a subsequent version of this
              License (see Section 10.2) or under the terms of a Secondary License (if
              permitted under the terms of Section 3.3).
            </p>

            <p className={classes.indent}>
              2.5. Representation
              <br />
              Each Contributor represents that the Contributor believes its
              Contributions are its original creation(s) or it has sufficient rights
              to grant the rights to its Contributions conveyed by this License.
            </p>

            <p className={classes.indent}>
              2.6. Fair Use
              <br />
              This License is not intended to limit any rights You have under
              applicable copyright doctrines of fair use, fair dealing, or other
              equivalents.
            </p>

            <p className={classes.indent}>
              2.7. Conditions
              <br />
              Sections 3.1, 3.2, 3.3, and 3.4 are conditions of the licenses granted
              in Section 2.1.
            </p>

            <span className={classes.subSection}>
              3. Responsibilities
            </span>

            <p className={classes.indent}>
              3.1. Distribution of Source Form
              <br />
              All distribution of Covered Software in Source Code Form, including any
              Modifications that You create or to which You contribute, must be under
              the terms of this License. You must inform recipients that the Source
              Code Form of the Covered Software is governed by the terms of this
              License, and how they can obtain a copy of this License. You may not
              attempt to alter or restrict the recipients&#39; rights in the Source Code
              Form.
            </p>

            <p className={classes.indent}>
              3.2. Distribution of Executable Form
              <br />
              If You distribute Covered Software in Executable Form then:

              <p className={classes.indent}>
                (a) such Covered Software must also be made available in Source Code
                Form, as described in Section 3.1, and You must inform recipients of
                the Executable Form how they can obtain a copy of such Source Code
                Form by reasonable means in a timely manner, at a charge no more
                than the cost of distribution to the recipient; and
              </p>

              <p className={classes.indent}>
                (b) You may distribute such Executable Form under the terms of this
                License, or sublicense it under different terms, provided that the
                license for the Executable Form does not attempt to limit or alter
                the recipients&#39; rights in the Source Code Form under this License.
              </p>
            </p>

            <p className={classes.indent}>
              3.3. Distribution of a Larger Work
              <br />
              You may create and distribute a Larger Work under terms of Your choice,
              provided that You also comply with the requirements of this License for
              the Covered Software. If the Larger Work is a combination of Covered
              Software with a work governed by one or more Secondary Licenses, and the
              Covered Software is not Incompatible With Secondary Licenses, this
              License permits You to additionally distribute such Covered Software
              under the terms of such Secondary License(s), so that the recipient of
              the Larger Work may, at their option, further distribute the Covered
              Software under the terms of either this License or such Secondary
              License(s).
            </p>

            <p className={classes.indent}>
              3.4. Notices
              <br />
              You may not remove or alter the substance of any license notices
              (including copyright notices, patent notices, disclaimers of warranty,
              or limitations of liability) contained within the Source Code Form of
              the Covered Software, except that You may alter any license notices to
              the extent required to remedy known factual inaccuracies.
            </p>

            <p className={classes.indent}>
              3.5. Application of Additional Terms
              <br />
              You may choose to offer, and to charge a fee for, warranty, support,
              indemnity or liability obligations to one or more recipients of Covered
              Software. However, You may do so only on Your own behalf, and not on
              behalf of any Contributor. You must make it absolutely clear that any
              such warranty, support, indemnity, or liability obligation is offered by
              You alone, and You hereby agree to indemnify every Contributor for any
              liability incurred by such Contributor as a result of warranty, support,
              indemnity or liability terms You offer. You may include additional
              disclaimers of warranty and limitations of liability specific to any
              jurisdiction.
            </p>

            <span className={classes.subSection}>
              4. Inability to Comply Due to Statute or Regulation
            </span>

            <p className={classes.indent}>
              If it is impossible for You to comply with any of the terms of this
              License with respect to some or all of the Covered Software due to
              statute, judicial order, or regulation then You must: (a) comply with
              the terms of this License to the maximum extent possible; and (b)
              describe the limitations and the code they affect. Such description must
              be placed in a text file included with all distributions of the Covered
              Software under this License. Except to the extent prohibited by statute
              or regulation, such description must be sufficiently detailed for a
              recipient of ordinary skill to be able to understand it.
            </p>

            <span className={classes.subSection}>
              5. Termination
            </span>

            <p className={classes.indent}>
              5.1. The rights granted under this License will terminate automatically
              if You fail to comply with any of its terms. However, if You become
              compliant, then the rights granted under this License from a particular
              Contributor are reinstated (a) provisionally, unless and until such
              Contributor explicitly and finally terminates Your grants, and (b) on an
              ongoing basis, if such Contributor fails to notify You of the
              non-compliance by some reasonable means prior to 60 days after You have
              come back into compliance. Moreover, Your grants from a particular
              Contributor are reinstated on an ongoing basis if such Contributor
              notifies You of the non-compliance by some reasonable means, this is the
              first time You have received notice of non-compliance with this License
              from such Contributor, and You become compliant prior to 30 days after
              Your receipt of the notice.
            </p>

            <p className={classes.indent}>
              5.2. If You initiate litigation against any entity by asserting a patent
              infringement claim (excluding declaratory judgment actions,
              counter-claims, and cross-claims) alleging that a Contributor Version
              directly or indirectly infringes any patent, then the rights granted to
              You by any and all Contributors for the Covered Software under Section
              2.1 of this License shall terminate.
            </p>

            <p className={classes.indent}>
              5.3. In the event of termination under Sections 5.1 or 5.2 above, all
              end user license agreements (excluding distributors and resellers) which
              have been validly granted by You or Your distributors under this License
              prior to termination shall survive termination.
            </p>

            <span className={classes.subSection}>
              6. Disclaimer of Warranty
            </span>

            <p className={classes.indent}>
              Covered Software is provided under this License on an &#34;as is&#34;
              basis, without warranty of any kind, either expressed, implied, or
              statutory, including, without limitation, warranties that the
              Covered Software is free of defects, merchantable, fit for a
              particular purpose or non-infringing. The entire risk as to the
              quality and performance of the Covered Software is with You.
              Should any Covered Software prove defective in any respect, You
              (not any Contributor) assume the cost of any necessary servicing,
              repair, or correction. This disclaimer of warranty constitutes an
              essential part of this License. No use of any Covered Software is
              authorized under this License except under this disclaimer.
            </p>

            <span className={classes.subSection}>
              7. Limitation of Liability
            </span>

            <p className={classes.indent}>
              Under no circumstances and under no legal theory, whether tort
              (including negligence), contract, or otherwise, shall any
              Contributor, or anyone who distributes Covered Software as
              permitted above, be liable to You for any direct, indirect,
              special, incidental, or consequential damages of any character
              including, without limitation, damages for lost profits, loss of
              goodwill, work stoppage, computer failure or malfunction, or any
              and all other commercial damages or losses, even if such party
              shall have been informed of the possibility of such damages. This
              limitation of liability shall not apply to liability for death or
              personal injury resulting from such party&#39;s negligence to the
              extent applicable law prohibits such limitation. Some
              jurisdictions do not allow the exclusion or limitation of
              incidental or consequential damages, so this exclusion and
              limitation may not apply to You.
            </p>

            <span className={classes.subSection}>
              8. Litigation
            </span>

            <p className={classes.indent}>
              Any litigation relating to this License may be brought only in the
              courts of a jurisdiction where the defendant maintains its principal
              place of business and such litigation shall be governed by laws of that
              jurisdiction, without reference to its conflict-of-law provisions.
              Nothing in this Section shall prevent a party&#39;s ability to bring
              cross-claims or counter-claims.
            </p>

            <span className={classes.subSection}>
              9. Miscellaneous
            </span>

            <p className={classes.indent}>
              This License represents the complete agreement concerning the subject
              matter hereof. If any provision of this License is held to be
              unenforceable, such provision shall be reformed only to the extent
              necessary to make it enforceable. Any law or regulation which provides
              that the language of a contract shall be construed against the drafter
              shall not be used to construe this License against a Contributor.
            </p>

            <span className={classes.subSection}>
              10. Versions of the License
            </span>

            <p className={classes.indent}>
              10.1. New Versions
              <br />
              Mozilla Foundation is the license steward. Except as provided in Section
              10.3, no one other than the license steward has the right to modify or
              publish new versions of this License. Each version will be given a
              distinguishing version number.
            </p>

            <p className={classes.indent}>
              10.2. Effect of New Versions
              <br />
              You may distribute the Covered Software under the terms of the version
              of the License under which You originally received the Covered Software,
              or under the terms of any subsequent version published by the license
              steward.
            </p>

            <p className={classes.indent}>
              10.3. Modified Versions
              <br />
              If you create software not governed by this License, and you want to
              create a new license for such software, you may create and use a
              modified version of this License if you rename the license and remove
              any references to the name of the license steward (except to note that
              such modified license differs from this License).
            </p>

            <p className={classes.indent}>
              10.4. Distributing Source Code Form that is Incompatible With Secondary
              Licenses
              <br />
              If You choose to distribute Source Code Form that is Incompatible With
              Secondary Licenses under the terms of this version of the License, the
              notice described in Exhibit B of this License must be attached.
            </p>

            <span className={classes.subSection}>
              Exhibit A - Source Code Form License Notice
            </span>

            <p className={classes.indent}>
              This Source Code Form is subject to the terms of the Mozilla Public
              License, v. 2.0. If a copy of the MPL was not distributed with this
              file, You can obtain one at http://mozilla.org/MPL/2.0/.
            </p>

            <p className={classes.indent}>
              If it is not possible or desirable to put the notice in a particular
              file, then You may include the notice in a location (such as a LICENSE
              file in a relevant directory) where a recipient would be likely to look
              for such a notice.
            </p>

            <p className={classes.indent}>
              You may add additional accurate notices of copyright ownership.
            </p>

            <p className={classes.indent}>
              Exhibit B - &#34;Incompatible With Secondary Licenses&#34; Notice
            </p>

            <p className={classes.indent}>
              This Source Code Form is &#34;Incompatible With Secondary Licenses&#34;, as
              defined by the Mozilla Public License, v. 2.0.
            </p>

            <span className={classes.subSection}>
              Exhibit B - &#34;Incompatible With Secondary Licenses&#34; Notice
            </span>

            <p className={classes.indent}>
              This Source Code Form is subject to the terms of the Mozilla Public
              License, v. 2.0. If a copy of the MPL was not distributed with this
              file, You can obtain one at{' '}
              <a href='http://mozilla.org/MPL/2.0/'>http://mozilla.org/MPL/2.0/</a>.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/googlearchive/tango-examples-c'>
                Tango Client API
              </a>
            </h4>
            <p>
              Copyright 2014 Google Inc. All Rights Reserved.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/google-ar/arcore-android-sdk'>
                ARCore
              </a>
            </h4>
            <p>
              Copyright (C) 2017 Google Inc.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://android.googlesource.com/platform/external/mdnsresponder'>
                mDNS Responder
              </a>
            </h4>
            <p>
              Copyright (c) 2002-2003 Apple Computer, Inc. All rights reserved.
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://android.googlesource.com/platform/frameworks/support/+/support-library-27.0.2'>
                Android Support Library
              </a>
            </h4>
            <p>
              Copyright (C) 2017 The Android Open Source Project
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <h4 className='font8-black'>
              <a href='https://github.com/libevent/libevent'>
                Libevent
              </a>
            </h4>

            <p>
              Libevent is available for use under the following license, commonly known
              as the 3-clause (or &#34;modified&#34;) BSD license:
            </p>

            <p>
              Copyright (c) 2000-2007 Niels Provos &#60;provos@citi.umich.edu&#62;
              <br />
              Copyright (c) 2007-2012 Niels Provos and Nick Mathewson
            </p>
            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ol>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
              <li>
                The name of the author may not be used to endorse or promote products
                derived from this software without specific prior written permission.
              </li>
            </ol>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <p>
              Portions of Libevent are based on works by others, also made available by them under
              the three-clause BSD license above.  The copyright notices are available in the
              corresponding source files; the license is as above.  Here&#39;s a list:
            </p>
            <p>
              log.c:
              <p className={classes.indentRight}>
                Copyright (c) 2000 Dug Song &#60;dugsong@monkey.org&#62;
                <br />
                Copyright (c) 1993 The Regents of the University of California.
              </p>

              strlcpy.c:
              <p className={classes.indentRight}>
                Copyright (c) 1998 Todd C. Miller &#60;Todd.Miller@courtesan.com&#62;
              </p>

              win32select.c:
              <p className={classes.indentRight}>
                Copyright (c) 2003 Michael A. Davis &#60;mike@datanerds.net&#62;
              </p>

              evport.c:
              <p className={classes.indentRight}>
                Copyright (c) 2007 Sun Microsystems
              </p>

              ht-internal.h:
              <p className={classes.indentRight}>
                Copyright (c) 2002 Christopher Clark
              </p>

              minheap-internal.h:
              <p className={classes.indentRight}>
                Copyright (c) 2006 Maxim Yegorushkin &#60;maxim.yegorushkin@gmail.com&#62;
              </p>
            </p>

            <hr />

            <p>
              The arc4module is available under the following, sometimes called the
              &#34;OpenBSD&#34; license:
            </p>

            <p>
              <p className={classes.indentRight}>
                Copyright (c) 1996, David Mazieres &#60;dm@uun.org&#62;
                <br />
                Copyright (c) 2008, Damien Miller &#60;djm@openbsd.org&#62;
              </p>
            </p>

            <p>
              Permission to use, copy, modify, and distribute this software for any purpose with or
              without fee is hereby granted, provided that the above copyright notice and this
              permission notice appear in all copies.
            </p>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <hr />

            <p>
              The Windows timer code is based on code from libutp, which is distributed under this
              license, sometimes called the &#34;MIT&#34; license.
            </p>

            <p>
              Copyright (c) 2010 BitTorrent, Inc.
            </p>

            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy of this
              software and associated documentation files (the &#34;Software&#34;), to deal in the
              Software without restriction, including without limitation the rights to use, copy,
              modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
              and to permit persons to whom the Software is furnished to do so, subject to the
              following conditions:
            </p>

            <p>
              The above copyright notice and this permission notice shall be included in all copies
              or substantial portions of the Software.
            </p>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <hr />

            <p>
              The wepoll module is available under the following, sometimes called the
              &#34;FreeBSD&#34; license:
            </p>

            <p>
              Copyright 2012-2020, Bert Belder &#60;bertbelder@gmail.com&#62;
              <br />
              All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification, are
              permitted provided that the following conditions are met:
            </p>

            <ul>
              <li>
                Redistributions of source code must retain the above copyright
                notice, this list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright
                notice, this list of conditions and the following disclaimer in the
                documentation and/or other materials provided with the distribution.
              </li>
            </ul>

            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &#34;AS IS&#34;
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
              IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
              LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
              PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
              WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
              ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGE.
            </p>

            <hr />
            <p>
              The ssl-client-mbedtls.c is available under the following license:
            </p>

            <p>
              Copyright (C) 2006-2015, ARM Limited, All Rights Reserved
              <br />
              SPDX-License-Identifier: Apache-2.0
            </p>

            <p>
              Licensed under the Apache License, Version 2.0 (the &#34;License&#34;); you may not
              use this file except in compliance with the License. You may obtain a copy of the
              License at
            </p>

            <p>
              <a href='http://www.apache.org/licenses/LICENSE-2.0' className={classes.indentLink}>
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>

            <p>
              Unless required by applicable law or agreed to in writing, software distributed under
              the License is distributed on an &#34;AS IS&#34; BASIS, WITHOUT WARRANTIES OR
              CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
              language governing permissions and limitations under the License.
            </p>

            <p>
              This file is part of mbed TLS{' '}
              (<a href='https://tls.mbed.org'>https://tls.mbed.org</a>)
            </p>

            <h4 className='font8-black'>
              <a href='https://www.openstreetmap.org/copyright'>
                OpenStreetMap
              </a>
            </h4>

            <p>Map data (c) OpenStreetMap Contributors</p>
            <a href='https://www.openstreetmap.org/copyright'>www.openstreetmap.org/copyright</a>

            <hr />
            <h4 className='font8-black'>
              <a href='https://github.com/openaddresses/openaddresses/blob/master/LICENSE'>
                OpenAddresses
              </a>
            </h4>
            <p>
              Data from Open Addresses © OpenAddresses.
              <br />
              BSD 3-Clause License
            </p>

            <p>Copyright (c) 2024 OpenAddresses 
              <br />
              All rights reserved.
            </p>

            <p>
              Redistribution and use in source and binary forms, with or without modification,
              are permitted provided that the following conditions are met:
            </p>
            <ul>
              <li>
                Redistributions of source code must retain the above copyright notice, this
                list of conditions and the following disclaimer.
              </li>
              <li>
                Redistributions in binary form must reproduce the above copyright notice, this
                list of conditions and the following disclaimer in the documentation and/or
                other materials provided with the distribution.
              </li>
              <li>
                Neither the name "OpenAddresses" nor the names of its contributors may be
                used to endorse or promote products derived from this software without
                specific prior written permission.
              </li>
            </ul>
            <p>
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
              ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
              DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
              ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
              (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
              LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
              ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
              (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
              SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>

            <hr />
            <h4 className='font8-black'>
              <a href='https://whosonfirst.org/docs/licenses/'>
                Who’s On First
              </a>
            </h4>
            <p>Data from Who’s On First.</p>
            <a href='https://whosonfirst.org/docs/licenses/'>https://whosonfirst.org/docs/licenses/</a>

            <hr />
            <h4 className='font8-black'>
              <a href='https://github.com/pelias/pelias/blob/master/LICENSE'>
                Pelias
              </a>
            </h4>
            <p>
              The MIT License (MIT)
            </p>

            <p>
              Copyright (c) 2014 Mapzen
            </p>

            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>

            <p>The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>

            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
