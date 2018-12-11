import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'redaction'
import actions from 'redux/actions'

import cssModules from 'react-css-modules'
import styles from './DownloadModal.scss'

import Modal from 'components/modal/Modal/Modal'
import Button from 'components/controls/Button/Button'
import CopyToClipboard from 'react-copy-to-clipboard'

import { FormattedMessage } from 'react-intl'

import { withRouter } from 'react-router'

@withRouter
@connect(
  ({
    user: { ethData, btcData, /* bchData, */ tokensData, eosData, telosData, nimData, usdtData, ltcData },
  }) => ({
    items: [ ethData, btcData, eosData, telosData, /* bchData, */ ltcData, usdtData /* nimData */ ],
  })
)
@cssModules(styles)
export default class DownloadModal extends React.Component {

  state = {
    isTextCopied: false,
    Ru: false,
  }

  componentWillMount() {
    this.checkLang()
  }

  handleCopyText = () => {
    this.setState({
      isTextCopied: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          isTextCopied: false,
        })
      }, 15 * 1000)
    })
  }

  checkLang = () => {
    const { match:{ params:{ locale } } } = this.props
    if (locale === 'ru') {
      this.setState({
        Ru: true,
      })
    }
  }

  render() {
    const { isTextCopied, Ru } = this.state
    const { items, name, match:{ params:{ locale } } } = this.props

    const textToCopy = actions.user.getText()

    const Account = () => (
      items.map(item => (
        <Fragment>
          {
            Ru ? (
              <p style={{ fontSize: '16px' }}>
                {item.fullName}
                {' '}
                {`${item.currency}` === 'EOS' || `${item.currency}` === 'TLOS' ? 'Имя Аккаунта:' : 'Адрес:'}
              </p>
            ) : (
              <p style={{ fontSize: '16px' }}>
                {item.fullName}
                {' '}
                {`${item.currency}` === 'EOS' || `${item.currency}` === 'TLOS' ? 'Account name:' : 'Address:'}
              </p>
            )
          }
          <p>{item.address}</p>
          <p style={{ fontSize: '16px' }}>
            {item.fullName}
            {' '}
            {Ru ? 'Приватный ключ' : 'Private key'}
            {' '}
          </p>
          <p>{item.privateKey}</p>
        </Fragment>
      ))
    )

    const title = [
      <FormattedMessage id="down97" defaultMessage="We don`t store your private keys and will not be able to restore them!" />,
    ]

    return (
      <Modal name={name} title={title}>
        <div styleName="subTitle">
          <FormattedMessage  id="down57" defaultMessage="It seems like you're using an IPhone or an IPad. Just copy this keys and paste into notepad textarea." />
        </div>
        <CopyToClipboard text={textToCopy} onCopy={this.handleCopyText}>
          <Button styleName="button" brand disabled={isTextCopied}>
            { isTextCopied ?
              <FormattedMessage id="down64" defaultMessage="Address copied to clipboard" /> :
              <FormattedMessage id="down65" defaultMessage="Copy to clipboard" />
            }
          </Button>
        </CopyToClipboard>
        <div styleName="indent">
          <Account />
        </div>
      </Modal>
    )
  }
}
