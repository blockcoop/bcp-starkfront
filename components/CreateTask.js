import { useStarknet, useStarknetInvoke } from "@starknet-react/core";
import { useCallback, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { encodeShortString } from "starknet/dist/utils/shortString";
import { useBlockcoopContract } from "../hooks/blockcoop.ts"

const CreateTask = ({coopAddress}) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)
    const { loading, error, reset, invoke } = useStarknetInvoke({ contract, method: 'create_task' })

    const [show, setShow] = useState(false)
    const [details, setDetails] = useState("")
    const [taskDeadline, setTaskDeadline] = useState("")
    const [votingDeadline, setVotingDeadline] = useState("")

    const handleCreateTask = useCallback(() => {
        if(details === '' || details === '0x' || taskDeadline === '' || votingDeadline === '') {
            toast.error("All fields compulsory", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }
        let currentTime = new Date().getTime() / 1000;
        let taskDeadlineTime = new Date(taskDeadline).getTime() / 1000;
        let votingDeadlineTime = new Date(votingDeadline).getTime() / 1000;
        if(votingDeadlineTime < currentTime) {
            toast.error("Invalid voting deadline", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }
        if(taskDeadlineTime < votingDeadlineTime) {
            toast.error("Voting deadline should be less than Task deadline", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }
        reset()
        if(account) {
            try {
                invoke({
                    args: [details, votingDeadlineTime, taskDeadlineTime],
                    metadata: { method: 'create_task', message: 'create a task' },
                })  
            } catch (error) {
                console.log(error)
            }
        } else {
            toast.error("Please connect wallet", {
                position: toast.POSITION.BOTTOM_CENTER
            })
        }
    
    }, [account, invoke, reset, details, taskDeadline, votingDeadline])

    return <>
        <Button variant="primary" onClick={() => setShow(true)}>
            Create Task
        </Button>
        <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="details">
                        <Form.Label>Task Details</Form.Label>
                        <Form.Control as="textarea" rows="3" onChange={(e) => setDetails(encodeShortString(e.target.value))} />
                        {details}
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="voting-deadline">
                            <Form.Label>Voting Deadline</Form.Label>
                            <Form.Control type="datetime-local" min={new Date()} value={votingDeadline} onChange={(e) => setVotingDeadline(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="task-deadline">
                            <Form.Label>Task Deadline</Form.Label>
                            <Form.Control type="datetime-local" min={new Date()}  value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} />
                        </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                {
                    loading ? 
                    <Button disabled>Creating Task <Spinner animation="border" size="sm" /></Button> :
                    <Button onClick={handleCreateTask}>Create Task</Button>
                }
            </Modal.Footer>
        </Modal>
    </>
}

export default CreateTask;