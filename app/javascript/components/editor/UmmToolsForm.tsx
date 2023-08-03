/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import { observer } from 'mobx-react'
import App from './App'
import UmmToolsModel from './model/UmmToolsModel'
import MetadataEditor from './MetadataEditor'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

interface UmmToolsFormProps {
  heading: string,
  token: string,
  user: string,
  provider: string,
  shouldRedirectAfterPublish: boolean
}
class UmmToolsForm extends React.Component<UmmToolsFormProps, never> {
  model: UmmToolsModel
  editor: MetadataEditor
  constructor(props: UmmToolsFormProps) {
    super(props)
    const {
      token, user, provider, shouldRedirectAfterPublish
    } = this.props

    this.model = new UmmToolsModel()
    this.editor = new MetadataEditor(this.model, token, user, provider, shouldRedirectAfterPublish)
  }

  render() {
    const { heading } = this.props
    return (
      <App editor={this.editor} heading={heading} />
    )
  }
}
export default observer(UmmToolsForm)
