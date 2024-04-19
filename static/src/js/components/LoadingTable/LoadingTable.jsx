import React from 'react'
import { Placeholder, Table } from 'react-bootstrap'

import { random } from 'lodash-es'

import { uniqueId } from 'react-bootstrap-typeahead/types/utils'

const LoadingTable = () => {
  const row = 20
  const randomColumn = random(4, 6)

  return (
    <>
      <div className="mb-4">
        <Placeholder as="span" animation="glow" className="mb-4">
          <Placeholder xs={8} />
        </Placeholder>
      </div>
      <Table bordered striped responsive="xl">
        <tbody>
          {
            [...Array(row)].map((rowIndex) => (
              <tr key={uniqueId(`${rowIndex}_loading_row_`)}>
                {
                  [...Array(randomColumn)].map((colIndex) => (
                    <td key={uniqueId(colIndex)}>
                      <Placeholder animation="glow" aria-hidden="true">
                        <Placeholder xs={randomColumn} />
                      </Placeholder>
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </Table>
    </>
  )
}

export default LoadingTable
