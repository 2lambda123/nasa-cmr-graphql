import React from 'react'
import {
  render, fireEvent, screen
} from '@testing-library/react'
import {
  BrowserRouter,
  MemoryRouter, Route, Routes
} from 'react-router-dom'
import { createSchemaUtils } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import CustomSelectWidget from '../CustomSelectWidget'
import UmmToolsModel from '../../../model/UmmToolsModel'
import MetadataEditor from '../../../MetadataEditor'
import MetadataEditorForm from '../../MetadataEditorForm'

describe('Custom Select Widget Component', () => {
  const model = new UmmToolsModel()
  const editor = new MetadataEditor(model)
  CustomSelectWidget.defaultProps = { title: '', options: { editor } }

  it('renders the custom select widget when no enum', async () => {
    const props = {
      label: 'MyTestDataLabel',
      required: false,
      schema: {},
      registry: { schemaUtils: createSchemaUtils(validator, {}) },
      options: { editor },
      onChange: {},
      value: 'Web Portal'
    }
    const { container } = render(
      <BrowserRouter>
        <CustomSelectWidget {...props} />
      </BrowserRouter>
    )
    expect(screen.getByTestId('custom-select-widget__my-test-data-label')).not.toHaveTextContent('My Test Data Label*')
    expect(screen.getByTestId('custom-select-widget__my-test-data-label--selector')).toHaveTextContent('Web Portal')
    expect(container).toMatchSnapshot()
  })
  it('renders the custom select widget when no option', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const schema = {
      enum: []
    }
    const props = {
      label: 'MyTestDataLabel',
      required: false,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema)
      },
      options: {
        title: '',
        editor
      },
      onChange: {}
    }
    const { container } = render(
      <BrowserRouter>
        <CustomSelectWidget {...props} />
      </BrowserRouter>
    )
    expect(screen.getByTestId('custom-select-widget__my-test-data-label')).not.toHaveTextContent('My Test Data Label*')
    expect(screen.getByTestId('custom-select-widget__my-test-data-label--selector')).not.toHaveTextContent('Web Portal')
    expect(container).toMatchSnapshot()
  })
  it('renders the custom select widget when required field', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const schema = {
      enum: ['Option1', 'Option2', 'Option3', 'Option4']
    }
    const props = {
      label: 'MyTestDataLabel',
      required: true,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema)
      },
      options: {
        title: 'My Test Data Label',
        editor
      },
      onChange: {}
    }
    const { container } = render(
      <BrowserRouter>
        <CustomSelectWidget {...props} />
      </BrowserRouter>
    )
    expect(screen.getByTestId('custom-select-widget__my-test-data-label')).toHaveTextContent('My Test Data Label')
    expect(container).toMatchSnapshot()
  })

  it('renders the custom select widget when required field without title', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const schema = {
      enum: ['Option1', 'Option2', 'Option3', 'Option4']
    }
    const props = {
      label: 'MyTestDataLabel',
      required: true,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema)
      },
      options: {
        editor
      },
      onChange: {}
    }
    const { container } = render(
      <BrowserRouter>
        <CustomSelectWidget {...props} />
      </BrowserRouter>
    )
    expect(screen.getByTestId('custom-select-widget__my-test-data-label')).toHaveTextContent('MyTestDataLabel')
    expect(container).toMatchSnapshot()
  })
  it('should call onChange when the first option is selected then second option', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const mockedOnChange = jest.fn()
    const schema = {
      enum: ['Option1', 'Option2', 'Option3', 'Option4']
    }
    const props = {
      label: 'MyTestDataLabel',
      required: true,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema)
      },
      options: {
        title: 'My Test Data Label',
        editor
      },
      onChange: mockedOnChange
    }
    const { container, getByText, queryByTestId } = render(
      <BrowserRouter>
        <CustomSelectWidget {...props} />
      </BrowserRouter>
    )

    const mySelectComponent = queryByTestId('custom-select-widget__my-test-data-label--selector')

    expect(mySelectComponent).toBeDefined()
    expect(mySelectComponent).not.toBeNull()
    expect(mockedOnChange).toHaveBeenCalledTimes(0)

    fireEvent.keyDown(mySelectComponent.firstChild, { key: 'ArrowDown' })
    fireEvent.click(await getByText('Option1'))
    expect(mockedOnChange).toHaveBeenCalledWith('Option1')

    fireEvent.keyDown(mySelectComponent.firstChild, { key: 'ArrowDown' })
    fireEvent.click(await getByText('Option3'))
    expect(mockedOnChange).toHaveBeenCalledWith('Option3')

    expect(mockedOnChange).toHaveBeenCalledTimes(2)
    expect(container).toMatchSnapshot()
  })

  it('select box works with items enums as well', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const mockedOnChange = jest.fn()
    const schema = {
      items: {
        enum: ['Option1', 'Option2', 'Option3', 'Option4']
      }
    }
    const props = {
      label: 'MyTestDataLabel',
      required: true,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema)
      },
      options: {
        title: 'My Test Data Label',
        editor
      },
      onChange: mockedOnChange
    }
    const { container, getByText, queryByTestId } = render(
      <BrowserRouter>
        <CustomSelectWidget {...props} />
      </BrowserRouter>
    )

    const mySelectComponent = queryByTestId('custom-select-widget__my-test-data-label--selector')

    expect(mySelectComponent).toBeDefined()
    expect(mySelectComponent).not.toBeNull()
    expect(mockedOnChange).toHaveBeenCalledTimes(0)

    fireEvent.keyDown(mySelectComponent.firstChild, { key: 'ArrowDown' })
    fireEvent.click(await getByText('Option1'))
    expect(mockedOnChange).toHaveBeenCalledWith('Option1')

    fireEvent.keyDown(mySelectComponent.firstChild, { key: 'ArrowDown' })
    fireEvent.click(await getByText('Option3'))
    expect(mockedOnChange).toHaveBeenCalledWith('Option3')

    expect(mockedOnChange).toHaveBeenCalledTimes(2)
    expect(container).toMatchSnapshot()
  })

  test('testing autofocus for a custom select widget', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Tool_Information']}>
        <Routes>
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    expect(container).toMatchSnapshot()
    const clickTextField = screen.queryAllByTestId('error-list-item__type')
    fireEvent.click(await clickTextField[0])
  })
})