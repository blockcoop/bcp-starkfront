import { useStarknet, useStarknetInvoke } from '@starknet-react/core'
import { useCallback, useState } from "react";
import { Button, Container, Form, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import { toast } from 'react-toastify';
import { toBN } from 'starknet/dist/utils/number';
import { encodeShortString } from 'starknet/dist/utils/shortString';

import { useCoopFactoryContract } from '../hooks/blockcoop.ts';

const CreateCoop = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [votingPeriod, setVotingPeriod] = useState(2);
  const [votingPeriodDuration, setVotingPeriodDuration] = useState(86400);
  const [gracePeriod, setGracePeriod] = useState(12);
  const [gracePeriodDuration, setGracePeriodDuration] = useState(3600);
  const [quorum, setQuorum] = useState(20);
  const [supermajority, setSupermajority] = useState(50);
  const [membershipFee, setMembershipFee] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const { account } = useStarknet()
  const { contract } = useCoopFactoryContract()
  const { loading, error, reset, invoke } = useStarknetInvoke({ contract, method: 'create_coop' })

  const handleCreateCoop = useCallback(() => {
    reset()
    if(account) {
      if(name === '' || name === '0x' || symbol === '' || symbol === '0x' ) {
        toast.error("Please enter name and symbol for your BlockCOOP", {
          position: toast.POSITION.BOTTOM_CENTER
        })
        return;
      }

      try {
        invoke({
          args: [name, symbol, 100000, quorum, supermajority],
          metadata: { method: 'create_coop', message: 'create new blockcoop' },
        })  
      } catch (error) {
        console.log(error)
      }
    } else {
      toast.error("Please connect wallet", {
        position: toast.POSITION.BOTTOM_CENTER
      })
    }

  }, [account, name, symbol, quorum, supermajority, invoke, reset])

  return (
    <Container className="main-content">
      <Form className="compact">
        <Row className="mb-3">
          <Col sm="8">
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                // value={name}
                onChange={(e) => setName(encodeShortString(e.target.value))}
              />
            </Form.Group>
            {name}
          </Col>
          <Col sm="4">
            <Form.Group controlId="symbol" className="mb-3">
              <Form.Label>Symbol</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Symbol"
                // value={symbol}
                onChange={(e) => setSymbol(encodeShortString(e.target.value))}
              />
            </Form.Group>
            {symbol}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm="6">
            <Form.Group controlId="voting-period">
              <Form.Label>Voting Period</Form.Label>
              <InputGroup className="mb-3">
                <Form.Select
                  value={votingPeriod}
                  onChange={(e) => setVotingPeriod(toBN(e.target.value))}
                >
                  {Array.from(Array(31).keys())
                    .slice(1)
                    .map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                </Form.Select>
                <Form.Select
                  value={votingPeriodDuration}
                  onChange={(e) => setVotingPeriodDuration(toBN(e.target.value))}
                >
                  <option value={3600}>Hours</option>
                  <option value={86400}>Days</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col sm="6">
            <Form.Group controlId="grace-period">
              <Form.Label>Grace Period</Form.Label>
              <InputGroup className="mb-3">
                <Form.Select
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(toBN(e.target.value))}
                >
                  {Array.from(Array(31).keys())
                    .slice(1)
                    .map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                </Form.Select>
                <Form.Select
                  value={gracePeriodDuration}
                  onChange={(e) => setGracePeriodDuration(toBN(e.target.value))}
                >
                  <option value={3600}>Hours</option>
                  <option value={86400}>Days</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm="4">
            <Form.Group controlId="quorum">
              <Form.Label>Quorum</Form.Label>
              <InputGroup className="mb-3">
                <Form.Select
                  value={quorum}
                  onChange={(e) => setQuorum(toBN(e.target.value))}
                >
                  {Array.from(Array(11).keys())
                    .slice(1)
                    .map((value) => (
                      <option key={value} value={value * 10}>
                        {value * 10}
                      </option>
                    ))}
                </Form.Select>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group controlId="quorum">
              <Form.Label>Supermajority</Form.Label>
              <InputGroup className="mb-3">
                <Form.Select
                  value={supermajority}
                  onChange={(e) => setSupermajority(toBN(e.target.value))}
                >
                  {Array.from(Array(11).keys())
                    .slice(1)
                    .map((value) => (
                      <option key={value} value={value * 10}>
                        {value * 10}
                      </option>
                    ))}
                </Form.Select>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group controlId="quorum">
              <Form.Label>Membership Fee</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="number"
                  step={0.1}
                  min={0}
                  placeholder="Fee"
                  value={membershipFee}
                  onChange={(e) => setMembershipFee(toBN(e.target.value))}
                />
                <InputGroup.Text>ETH</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <div className="text-center mt-5">
          {loading ? (
            <Button size="lg" disabled>
              Creating a COOP &nbsp; <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button size="lg" onClick={handleCreateCoop}>
              Create a COOP
            </Button>
          )}
        </div>
        {error && <p>Error: {error}</p>}
      </Form>
    </Container>
  );
};

export default CreateCoop;
