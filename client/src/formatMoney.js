const formatMoney = (amount) => {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    })

    let formattedValue = formatter.format(amount)

    return formattedValue
}

export default formatMoney