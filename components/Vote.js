import { useStarknet, useStarknetCall, useStarknetInvoke } from "@starknet-react/core";
import { useCallback, useMemo, useState } from "react";
import { Button, Col, Collapse, Row, Spinner } from "react-bootstrap";
import { useBlockcoopContract } from "../hooks/blockcoop.ts"

const Vote = ({ coopAddress, taskId }) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)

    const [isVoted, setIsVoted] = useState(null)

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'isVoted',
        args: [taskId, account],
    })

    useMemo(() => {
        if (loading || !data?.length) {
          return
        }
    
        if (error) {
          return
        }
    
        const voted = data[0]
        console.log(voted)
        if(voted == 1) {
            setIsVoted(true)
        } else {
            setIsVoted(false)
        }
        
    }, [data, loading, error])

    return <>
        {
            isVoted !== null &&
            <>
            {
                isVoted ?
                <p>You have voted for this task</p> :
                <TaskVote coopAddress={coopAddress} taskId={taskId} />
            }
            </>
        }
    </>
}

const TaskVote = ({ coopAddress, taskId }) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)
    const { loading, error, reset, invoke } = useStarknetInvoke({ contract, method: 'vote_for_task' })
    const [open, setOpen] = useState(false);

    const handleVoting = useCallback((vote) => {
        setOpen(false)
        reset()
        if(account) {
            try {
                invoke({
                    args: [taskId, vote],
                    metadata: { method: 'vote_for_task', message: 'vote for a task' },
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

    return <Row>
        <Col md="auto">
            {
                loading ?
                <Button disabled>Voting for Task <Spinner animation="border" size="sm" /> </Button> :
                <Button onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}>Vote for Task</Button>
            }
            
        </Col>
        <Col>
            <Collapse in={open} dimension="width">
                <div id="example-collapse-text">
                    <ul className="list-inline" style={{width: '400px'}}>
                        <li className="list-inline-item">
                            <Button variant="success" size="sm" onClick={()=> handleVoting(1)}>Yes</Button>
                        </li>
                        <li className="list-inline-item">
                            <Button variant="danger" size="sm" onClick={()=> handleVoting(0)}>No</Button>
                        </li>
                    </ul>
                </div>
            </Collapse>
        </Col>
    </Row>
}

export default Vote;