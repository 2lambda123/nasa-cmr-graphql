import React from 'react'
import PropTypes from 'prop-types'
import BootstrapButton from 'react-bootstrap/Button'
import classNames from 'classnames'

import './Button.scss'
import { FaExternalLinkAlt } from 'react-icons/fa'

/**
 * @typedef {Object} ButtonProps
 * @property {String} className Class name to apply to the button
 * @property {ReactNode} children The children of the button
 * @property {Boolean} external An optional boolean which sets `target="_blank"` and an external link icon
 * @property {String} href An optional string which triggers the use of an `<a>` tag with the designated href
 * @property {Function} [Icon] An optional icon `react-icons` icon. A iconTitle should be set when setting an icon.
 * @property {Function} [iconOnly] An optional boolean that hides the button content
 * @property {Function} [iconTitle] An optional icon `react-icons` icon
 * @property {Boolean} [naked] An optional boolean passed to render a button with no background or border
 * @property {Function} onClick A callback function to be called when the button is clicked
 * @property {String} [size] An optional string passed to React Bootstrap to change the size of the button
 * @property {String} [variant] An optional string passed to React Bootstrap to change the variant
 */

/*
 * Renders a `Button` component.
 *
 * The component is renders a button, optionally displaying an icon
 *
 * @param {ButtonProps} props
 *
 * @component
 * @example <caption>Render a button with an icon</caption>
 * return (
 *   <Button
 *      size="sm"
 *      variant="primary"
 *      Icon={FaStar}
 *      iconTitle="Star"
 *   >
 *     Click me!
 *   </Button>
 * )
 */
const Button = React.forwardRef(({
  className,
  children,
  disabled,
  external,
  href,
  Icon,
  iconOnly,
  iconTitle,
  inline,
  naked,
  onClick,
  size,
  variant
}, ref) => {
  // Create an object to pass any conditional properties. These are ultimately spread on the component.
  const conditionalProps = {}

  if (onClick) {
    conditionalProps.onClick = onClick
  }

  if (href) {
    conditionalProps.href = href

    if (external) conditionalProps.target = '_blank'
  }

  return (
    <BootstrapButton
      ref={ref}
      className={
        classNames([
          'align-items-center text-nowrap',
          {
            'd-flex': !inline,
            'd-inline-flex p-0': inline,
            'button--naked': naked,
            'px-2': iconOnly,
            [className]: className
          }
        ])
      }
      size={size}
      variant={variant}
      disabled={disabled}
      {...conditionalProps}
    >
      {
        Icon && (
          <Icon
            title={iconTitle}
            role="img"
            className={
              classNames([
                {
                  'me-0': iconOnly,
                  'me-2': !iconOnly && size !== 'lg',
                  'me-3': !iconOnly && size === 'lg'
                }
              ])
            }
          />
        )
      }
      {
        iconOnly
          ? (
            <span className="visually-hidden">{children}</span>
          )
          : children
      }
      {
        external && (
          <FaExternalLinkAlt className="ms-1 small" style={{ opacity: 0.625 }} />
        )
      }
    </BootstrapButton>
  )
})

Button.displayName = 'Button'

Button.defaultProps = {
  children: null,
  className: '',
  disabled: false,
  external: false,
  Icon: undefined,
  iconOnly: false,
  iconTitle: undefined,
  inline: false,
  href: null,
  naked: false,
  onClick: null,
  size: '',
  variant: ''
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  href: PropTypes.string,
  Icon: PropTypes.func,
  iconOnly: PropTypes.bool,
  inline: PropTypes.bool,
  iconTitle: ({ Icon, iconTitle }) => {
    if (!!Icon && !iconTitle) {
      return new Error('An iconTitle is required when rendering an Icon. The iconTitle will be used as the <title> on the <svg>')
    }

    return null
  },
  naked: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  variant: PropTypes.string
}

export default Button