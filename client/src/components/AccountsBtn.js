import React from 'react'
import FlatButton from 'material-ui/FlatButton'

const AccountsBtn = ({
    visible,
    onClick
}) => (
        <span>
            {
                visible &&
                <FlatButton label="Accounts" onClick={onClick} />
            }
        </span>
    )

export default AccountsBtn