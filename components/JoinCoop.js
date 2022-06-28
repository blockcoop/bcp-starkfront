import { useStarknet, useStarknetInvoke } from "@starknet-react/core"
import { useCallback } from "react"
import { Button, Spinner } from "react-bootstrap"
import { useBlockcoopContract } from "../hooks/blockcoop.ts"

const JoinCoop = ({coopAddress}) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)
    const { loading, error, reset, invoke } = useStarknetInvoke({ contract, method: 'join_coop' })

    const handleJoin = useCallback(() => {
        reset()
        if(account) {
          try {
            invoke({
              args: [],
              metadata: { method: 'join_coop', message: 'join a blockcoop' },
            })  
          } catch (error) {
            console.log(error)
          }
        } else {
          toast.error("Please connect wallet", {
            position: toast.POSITION.BOTTOM_CENTER
          })
        }
    
      }, [account, invoke, reset])

    return <>
        {
            loading ?
            <Button disabled>Joining Coop <Spinner animation="border" size="sm" /></Button> :
            <Button onClick={handleJoin}>Join Coop</Button>
        }
        
    </>
}

export default JoinCoop