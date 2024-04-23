import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import Breadcrumb from 'react-bootstrap/Breadcrumb'
import PrimaryNavigation from '../PrimaryNavigation/PrimaryNavigation'
import For from '../For/For'

import { getUmmVersionsConfig } from '../../../../../sharedUtils/getConfig'

import './Page.scss'

/**
 * @typedef {Object} HeaderAction
 * @property {String} label The label for the header action.
 * @property {String} to The location to be passed to react router.
 */

/**
 * @typedef {Object} Breadcrumb
 * @property {String} label The label for the header action.
 * @property {String} to The location to be set when clicked.
 * @property {Boolean} active A boolean flag to trigger the active state
 */

/**
 * @typedef {Object} PageProps
 * @property {Array.<Breadcrumb>} breadcrumbs The page content.
 * @property {ReactNode} children The page content.
 * @property {Array.<HeaderAction>} headerActions The page content.
 * @property {String} pageType A string representing the type of page.
 * @property {String} secondaryTitle A secondary title.
 * @property {String} title A string of text to serve as the page title.
 */

/*
 * Renders a `For` component.
 *
 * The component is used to create a page
 *
 * @param {PageProps} props
 *
 * @component
 * @example <caption>Render a page</caption>
 * return (
 *   <Page
 *      title="This is a title"
 *      pageType="primary"
 *      headerActions={[{ label: 'Action Label', to="/action/location" }]}
 *   >
 *      <div>This is some page content</div>
 *   </Page>
 * )
 */
const Page = ({
  breadcrumbs,
  children,
  className,
  headerActions,
  navigation,
  pageType,
  secondaryTitle,
  title
}) => {
  const {
    ummC,
    ummS,
    ummT,
    ummV
  } = getUmmVersionsConfig()

  return (
    <main
      className={
        classNames([
          'flex-grow-1 d-flex flex-row',
          {
            [className]: className
          }
        ])
      }
    >
      {
        navigation && (
          <header className="page__header d-flex grow-0 flex-shrink-0">
            <PrimaryNavigation
              items={
                [
                  {
                    to: '/collections',
                    title: 'Collections',
                    version: `v${ummC}`
                  },
                  {
                    to: '/variables',
                    title: 'Variables',
                    version: `v${ummV}`
                  },
                  {
                    to: '/services',
                    title: 'Services',
                    version: `v${ummS}`
                  },
                  {
                    to: '/tools',
                    title: 'Tools',
                    version: `v${ummT}`
                  },
                  {
                    to: '/order-options',
                    title: 'Order Options'
                  }
                ]
              }
            />
          </header>
        )
      }

      <div className="w-100 overflow-hidden">
        <Container fluid className="mx-0 mb-5">
          <Row className="py-3 border-bottom border-gray-200 mb-4">
            <Col>
              <header
                className={
                  classNames(
                    [
                      'd-flex flex-column align-items-start',
                      {
                        'sr-only': pageType === 'primary',
                        '': pageType !== 'primary'
                      }
                    ]
                  )
                }
              >
                {
                  breadcrumbs.length > 0 && (
                    <Breadcrumb>
                      <For each={breadcrumbs}>
                        {
                          ({ active, label, to }, i) => {
                            if (!label) return null

                            return (
                              <Breadcrumb.Item
                                key={`breadcrumb-link_${to}_${i}`}
                                active={active}
                                linkProps={{ to }}
                                linkAs={Link}
                              >
                                {label}
                              </Breadcrumb.Item>
                            )
                          }
                        }
                      </For>
                    </Breadcrumb>
                  )
                }
                <div className="d-flex align-items-center">
                  <h2 className="m-0 text-gray-200 h4" style={{ fontWeight: 700 }}>
                    {title}
                    {secondaryTitle && <span className="text-secondary h4 fw-lighter">{` ${secondaryTitle}`}</span>}
                  </h2>
                  {
                    headerActions && headerActions.length > 0 && (
                      <div className="ms-4">
                        <For each={headerActions}>
                          {
                            ({
                              label,
                              to
                            }) => (
                              <Link className="me-2 btn btn-sm btn-primary" key={label} to={to}>{label}</Link>
                            )
                          }
                        </For>
                      </div>
                    )
                  }
                </div>
              </header>
            </Col>
          </Row>
          <Row>
            <Col>
              {children}
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  )
}

Page.defaultProps = {
  breadcrumbs: [],
  className: null,
  headerActions: [],
  navigation: true,
  pageType: 'primary',
  secondaryTitle: null,
  title: null
}

Page.propTypes = {
  // Disabling the following rule to allow undefined to be passed as a value in the array
  // eslint-disable-next-line react/forbid-prop-types
  breadcrumbs: PropTypes.array,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  headerActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired
    }).isRequired
  ),
  navigation: PropTypes.bool,
  pageType: PropTypes.string,
  secondaryTitle: PropTypes.string,
  title: PropTypes.string
}

export default Page
