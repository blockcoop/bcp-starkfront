import { useStarknet, useStarknetInvoke } from "@starknet-react/core"
import { useCallback } from "react"
import { Button, Spinner } from "react-bootstrap"
import { useBlockcoopContract } from "../hooks/blockcoop.ts"

const ProcessVoting = ({ coopAddress, taskId }) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)
    const { loading, error, reset, invoke } = useStarknetInvoke({ contract, method: 'process_voting' })

    const handleProcessVoting = useCallback(() => {
        reset()
        if(account) {
            try {
                invoke({
                    args: [taskId],
                    metadata: { method: 'process_voting', message: 'process voting for a task' },
                })  
            } catch (error) {
                console.log(error)
                toast.error(error, {
                    position: toast.POSITION.BOTTOM_CENTER
                })
            }
        } else {
            toast.error("Please connect wallet", {
                position: toast.POSITION.BOTTOM_CENTER
            })
        }
    
    }, [account, invoke, reset, taskId])

    return <>
        {
            loading ?
            <Button disabled>Processing Voting <Spinner animation="border" size="sm" /></Button> :
            <Button onClick={handleProcessVoting}>Process Voting</Button>
        }
        
    </>
}

export default ProcessVoting;