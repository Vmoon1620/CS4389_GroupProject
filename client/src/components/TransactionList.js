import React from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import moment from 'moment'
import formatMoney from '../formatMoney'

const formatDisplayAmount = (amount) => {
    return amount ? formatMoney(amount) : ' - '
}

const TransactionList = ({
    transactions
}) => (
        <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn>Date</TableHeaderColumn>
                    <TableHeaderColumn>Type</TableHeaderColumn>
                    <TableHeaderColumn>Amount</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {
                    transactions.map(transaction => {
                        return (
                            <TableRow key={transaction.transaction_id}>
                                <TableRowColumn>{moment(transaction.timestamp).fromNow()}</TableRowColumn>
                                <TableRowColumn>{transaction.type}</TableRowColumn>
                                <TableRowColumn>{formatDisplayAmount(transaction.amount)}</TableRowColumn>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    )

export default TransactionList
