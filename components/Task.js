import { useStarknet, useStarknetCall } from "@starknet-react/core"
import { useMemo, useState } from "react"
import { Badge, ListGroup, Spinner } from "react-bootstrap"
import Moment from "react-moment"
import { toHex } from "starknet/dist/utils/number"
import { decodeShortString } from "starknet/dist/utils/shortString"
import { useBlockcoopContract } from "../hooks/blockcoop.ts"
import EtherscanAddressLink from "./EtherscanAddressLink"
import ProcessVoting from "./ProcessVoting"
import Vote from "./Vote"

const Task = ({ coopAddress, taskId }) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)
    const [task, setTask] = useState(null)

    let currentTime = new Date().getTime() / 1000;

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'getTask',
        args: [taskId],
    })

    const statuses = {
        0: 'Proposed',
        1: 'Not Accepted',
        2: 'Cancelled',
        3: 'Started',
        4: 'Failed',
        5: 'Completed'
    }

    const statusColor = {
        0: 'warning',
        1: 'primary',
        3: 'secondary',
        4: 'info',
        5: 'danger',
        6: 'success'
    }

    useMemo(() => {
        if (loading || !data?.length) {
            return
        }
    
        if (error) {
            return
        }
    
        if(data.length > 0) {
            const obj = {
                creator: toHex(data.creator),
                details: decodeShortString(toHex(data.details)),
                status: parseInt(data.status.toString(10)),
                task_deadline: parseInt(data.task_deadline.toString(10)),
                voting_deadline: parseInt(data.voting_deadline.toString(10)),
            }
            setTask(obj)
        }
        
    }, [data, loading, error])
    return <ListGroup.Item className="p-4">
    {
        task ?
        <>
            <h5 className="fw-bold">
                Task {taskId}
                <Badge bg={statusColor[task.status]} className="float-end">{statuses[task.status]}</Badge>
            </h5>
            <p>{task.details}</p>
            <ul className="list-inline">
                <li className="list-inline-item me-4">
                    Creator: <b><EtherscanAddressLink address={task.creator} /></b>
                </li>
                <li className="list-inline-item me-4">
                    Voting Deadline: {" "}
                    <b><Moment unix format="DD/MM/YYYY hh:mm a">{task.voting_deadline}</Moment></b>
                </li>
                <li className="list-inline-item">
                    Task Deadline:  {" "}
                    <b><Moment unix format="DD/MM/YYYY hh:mm a">{task.task_deadline}</Moment></b>
                </li>
            </ul>
            <div>
            {
                task.status == 0 &&
                <>{
                    task.voting_deadline > currentTime ?
                    <Vote coopAddress={coopAddress} taskId={taskId} /> : <>
                    {
                        account === task.creator &&
                        <ProcessVoting coopAddress={coopAddress} taskId={taskId} />
                    }
                    </>
                }</>

            }
            {
                (task.status == 3 && account === task.creator && task.task_deadline < currentTime) &&
                <>
                {
                    <>Process task</>
                }
                </>
            }
            </div>
        </> : <>Loading <Spinner animation="border" size="sm" /></>
    }
    </ListGroup.Item>
}

export default Task;