import { useStarknet, useStarknetCall } from "@starknet-react/core"
import { useMemo, useState } from "react"
import { Badge, ListGroup } from "react-bootstrap"
import { useBlockcoopContract } from "../hooks/blockcoop.ts"
import CreateTask from "./CreateTask"
import Task from "./Task"

const Tasks = ({coopAddress}) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)
    const [taskCount, setTaskCount] = useState(null)

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'getTaskCount',
        args: account? account : undefined,
    })

    useMemo(() => {
        if (loading || !data?.length) {
            return
        }
    
        if (error) {
            return
        }
    
        if(data.length > 0) {
            setTaskCount(data[0].toString(10))
        }
        
    }, [data, loading, error])

    return <div>
        {
            taskCount !== null ?
            <>
                <h4 className="fw-bold mb-3">
                    Tasks <Badge pill bg="secondary">{taskCount}</Badge> {" "}
                    <CreateTask coopAddress={coopAddress} />
                </h4>
                {
                    taskCount > 0 ?
                    <ListGroup>
                        { Array.from(Array((parseInt(taskCount) + 1)).keys()).slice(1).reverse().map(value => <Task key={value} coopAddress={coopAddress} taskId={value} />) }
                    </ListGroup> :
                    <h5>No Tasks</h5>
                }
            </> :
            <></>
        }
    </div>
}

export default Tasks;