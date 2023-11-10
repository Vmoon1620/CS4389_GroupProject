import React from 'react'
import FlatButton from 'material-ui/FlatButton'

const ProfileBtn = ({
    visible,
    onClick
}) => (
        <span>
            {
                visible &&
                <FlatButton label="Profile" onClick={onClick} />
            }
        </span>
    )

export default ProfileBtn