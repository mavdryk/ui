/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Loader } from 'igz-controls/components'

import { generateNuclioIframeLink } from '../../utils'

import './nuclioFunctions.scss'

const NuclioFunctions = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [nuclioSrc, setNuclioSrc] = useState('')
  const [iframeIsLoaded, setIframeIsLoaded] = useState(false)
  const [postMessageIsReceived, setPostMessageIsReceived] = useState(false)
  const [failedToLoadNuclio, setFailedToLoadNuclio] = useState(false)

  useEffect(() => {
    setNuclioSrc(generateNuclioIframeLink(location.pathname))
    setIframeIsLoaded(false)
    setPostMessageIsReceived(false)
    setFailedToLoadNuclio(false)
  }, [location.pathname])

  useLayoutEffect(() => {
    const handleMessage = event => {
      if (event.origin !== window.mlrunConfig.nuclioUiUrl) return

      setPostMessageIsReceived(true)

      if (event.data?.type === 'REDIRECT') {
        navigate(event.data.value)
      }

      if (event.data?.type === 'IFRAME_URL_CHANGE') {
        const iframeUrl = event.data.value
        const newUrl = iframeUrl.replace(
          /(\/projects\/[^/]+\/)functions(?=\/|\?|$)/,
          '$1nuclio-functions'
        )

        if (window.location.pathname !== newUrl) {
          window.history.replaceState(window.history.state, '', newUrl)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [navigate])

  useLayoutEffect(() => {
    if (iframeIsLoaded) {
      setFailedToLoadNuclio(!postMessageIsReceived)
    }
  }, [iframeIsLoaded, postMessageIsReceived])

  return (
    <div className="content-wrapper">
      {!iframeIsLoaded && !failedToLoadNuclio && <Loader />}
      {failedToLoadNuclio && (
        <div className="nuclio-error">
          <h2 className="nuclio-error__title">Nuclio App Unavailable</h2>
          <p className="nuclio-error__description">
            The <strong>Nuclio</strong> app could not be loaded.
            <span>
              Please check your network connection or make sure the <strong>Nuclio</strong> path was
              properly injected.
            </span>
          </p>
        </div>
      )}
      {nuclioSrc && !failedToLoadNuclio && (
        <iframe
          className="iframe"
          src={nuclioSrc}
          onLoad={() => {
            setIframeIsLoaded(true)
          }}
        ></iframe>
      )}
    </div>
  )
}

export default React.memo(NuclioFunctions)
