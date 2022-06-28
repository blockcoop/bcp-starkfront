import { useStarknet, useStarknetCall, useStarknetInvoke } from "@starknet-react/core"
import { useCallback, useMemo, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Account } from "starknet"
import { toBN, toFelt, toHex } from "starknet/dist/utils/number"
import { decodeShortString, encodeShortString } from "starknet/dist/utils/shortString"
import { useBalanceContract } from "../hooks/blockcoop.ts"

const UserBalance = () => {
    const { account } = useStarknet()
    const { contract } = useBalanceContract()

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_balance',
        args: account ? [account] : undefined,
    })

    const content = useMemo(() => {
        if (loading || !data?.length) {
          return <div>Loading balance</div>
        }
    
        if (error) {
          return <div>Error: {error}</div>
        }
    
        const balance = data[0]
        return <div>{balance.toString(10)}</div>
    }, [data, loading, error])
    
    return (
        <div>
            <h2>User balance</h2>
            {content}
        </div>
    )
}

const UserName = () => {
    const { account } = useStarknet()
    const { contract } = useBalanceContract()

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_name',
        args: account ? [account] : undefined,
    })

    const content = useMemo(() => {
        if (loading || !data?.length) {
          return <div>Loading name</div>
        }
    
        if (error) {
          return <div>Error: {error}</div>
        }
    
        
        const name = decodeShortString(toHex(data[0]))
        console.log(name)
        return <div>{name}</div>
    }, [data, loading, error])
    
    return (
        <div>
            <h2>User Name</h2>
            {content}
        </div>
    )
}

const UpdateBalance = () => {
    const { account } = useStarknet()
    const [amount, setAmount] = useState('')
    const [amountError, setAmountError] = useState('')

    const { contract } = useBalanceContract()

    const { loading, error, reset, invoke } = useStarknetInvoke({ contract, method: 'update_balance' })

    const updateAmount = useCallback(
        (newAmount) => {
            setAmount(newAmount)
            try {
                toBN(newAmount)
                setAmountError(undefined)
            } catch (err) {
                console.error(err)
                setAmountError('Please input a valid number')
            }
        },
        [setAmount]
    )

    const handleUpdate = useCallback(() => {
        reset()
        if (account && !amountError) {
          const message = `${amount.toString()} balance to ${account}`
          invoke({ args: [amount], metadata: { method: 'update_balance', message } })
        }
      }, [account, amount, amountError, invoke, reset])

    const updateButtonDisabled = useMemo(() => {
        if (loading) return true
        return !account || !!amountError
    }, [loading, account, amountError])

    return (
        <div>
            <h4>Update Balance</h4>
            <p>
                <span>Amount: </span>
                <input type="number" onChange={(evt) => updateAmount(evt.target.value)} />
            </p>
            <Button disabled={updateButtonDisabled} onClick={handleUpdate}>
                {loading ? 'Waiting for wallet' : 'Update Balance'}
            </Button>
            {error && <p>Error: {error}</p>}
            {amountError && <p>Error: {amountError}</p>}
        </div>
    )
}

const UpdateName = () => {
    const { account } = useStarknet()
    const [name, setName] = useState('')
    // const [amountError, setAmountError] = useState('')

    const { contract } = useBalanceContract()

    const { loading, error, reset, invoke } = useStarknetInvoke({ contract, method: 'update_name' })

    const updateName = useCallback(
        (_name) => {
            setName(_name)
            try {
                setName(encodeShortString(_name))
            } catch (err) {
                console.error(err)
            }
        },
        [setName]
    )

    const handleUpdate = useCallback(() => {
        reset()
        if (account) {
          const message = `${name.toString()} name to ${account}`
          invoke({ args: [name], metadata: { method: 'update_name', message } })
        }
      }, [account, name, invoke, reset])

    const updateButtonDisabled = useMemo(() => {
        if (loading) return true
        return !account
    }, [loading, account])

    return (
        <div>
            <h4>Update Name</h4>
            <p>
                <span>Name: </span>
                <input type="text" onChange={(evt) => updateName(evt.target.value)} />
            </p>
            <Button disabled={updateButtonDisabled} onClick={handleUpdate}>
                {loading ? 'Waiting for wallet' : 'Update Name'}
            </Button>
            {error && <p>Error: {error}</p>}
        </div>
    )
}

const Balance = () => {

    const { account } = useStarknet()

    if (!account) {
        return (
            <div>
                <p>Connect Wallet</p>
            </div>
        )
    }

    return (
        <Container className="main-content">
            <p>Connected: {account}</p>
            <Row>
                <Col>
                    <UserBalance />
                    <UpdateBalance />
                </Col>
                <Col>
                    <UserName />
                    <UpdateName />
                </Col>
            </Row>
        </Container>
    )
}

export default Balance