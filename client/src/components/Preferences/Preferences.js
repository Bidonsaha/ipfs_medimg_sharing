import React, { useState, useEffect } from "react";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import getWeb3 from "../../getWeb3";
import ipfs from "../../ipfs";
import { Button, Modal, ListGroup, Col, Row, Image } from "react-bootstrap";

const { abi } = require("../../contracts/Migrations.json");

const Preferences = (props) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [patInfo, setPatInfo] = useState({});
  const [patList, setPatList] = useState([]);
  const [pblocks, setPblocks] = useState([]);
  const [patID, setPatID] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [simpleStorageInstance, setSimpleStorageInstance] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  useEffect(() => {
    getWeb3
      .then((results) => {
        setWeb3(results.web3);
        console.log("results...", results);
        console.log("web3...", web3);

        // Instantiate contract once web3 provided.
        instantiateContract();
        // this.instantiateContractNew();
        // console.log("accoubnt", this.state.account);
        // console.log("web3bbb", this.state.web3);
        // console.log("abi", abi);
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }, [account, patInfo, patList, pblocks, reportLink]);

  const MovieList = ({ movies }) =>
    movies.map((movie, index) => (
      <ListGroup.Item key={movie.Hash}>
        <Row>
          <Col md={4}>
            <Image
              src={`https://ipfs.io/ipfs/${movie.Hash}`}
              alt=""
              className="img-fluid"
            />{" "}
          </Col>
        </Row>
      </ListGroup.Item>
    ));

  function Popup(props) {
    let name = props;
    const openInNewTab = (url) => {
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    };
    console.log(name);
    return (
      <>
        {/* <Button
          bsStyle="primary"
          bsSize="large"
          variant="primary"
          onClick={handleShow}
        >
          Launch static backdrop modal
        </Button> */}

        <Modal
          show={true}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{patID} Patient's Images </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: "calc(100vh - 210px)",
              overflowY: "auto",
            }}
          >
            <ListGroup>
              {" "}
              {/* <----- put your list const here */}
              <MovieList movies={props.value} />
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => openInNewTab(`https://ipfs.io/ipfs/${reportLink}`)}
            >
              Report
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  const instantiateContract = async () => {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require("@truffle/contract");
    const simpleStorage = contract(SimpleStorageContract);
    console.log("contract: ", contract);
    console.log("simpleStorage", simpleStorage);
    simpleStorage.setProvider(web3.currentProvider);

    // Get accounts.
    const accounts = await web3.eth.getAccounts();
    console.log("accounts1", accounts);
    simpleStorage
      .deployed()
      .then((instance) => {
        setSimpleStorageInstance(instance);
        // console.log("this.simpl", simpleStorageInstance);
        // console.log("accounts", accounts);
        // this.setState({ account: accounts[0] });
        // console.log("account", this.state.account);
        setAccount(accounts[0]);
        console.log("account...", account);
        return simpleStorageInstance.get.call(account);
      })
      .then((ipfsHash) => {
        // Update state with the result.
        // return this.setState({ ipfsHash });
      });
  };

  async function getUsers(pblocks) {
    let sArray = [];
    const pArray = pblocks.map(async (block) => {
      let temp = await web3.eth.getBlock(block);
      console.log(temp);
      web3.eth.getTransaction(temp.transactions[0], async (err, tx) => {
        // console.log("tx", tx);
        let tx_data = tx.input;
        // let input_data = "0x" + tx_data.slice(10); // get only data without function selector
        // console.log("inisnde gettx func input data", input_data);
        // let ress = web3.utils.toString(input_data);
        // console.log("resss", String(ress));
        // console.log("tx_input_len", tx_data.length);
        // console.log("tx_input", tx_data);
        let res = web3.utils.toAscii(
          tx_data.slice(0, 2) + tx_data.substring(10)
        );
        // let i = res.indexOf("{");
        // res = res.substring(i);
        // // setResHash(res);
        // // console.log(resHash);
        // console.log("ressss...", res);
        let re = /{.*}/g;
        res = res.match(re)[0];
        res = JSON.parse(res);
        // console.log(res);
        // await setPatInfo(res);
        // console.log(patInfo);
        console.log("res inside ....", res);
        sArray.push(res);
        // return res;
      });
    });
    const users = await Promise.all(pArray);
    // ... do some stuf
    console.log("parray..", sArray);
    return sArray;
  }

  async function getReport(block) {
    let temp = await web3.eth.getBlock(block);
    console.log(temp);
    web3.eth.getTransaction(temp.transactions[0], async (err, tx) => {
      // console.log("tx", tx);
      let tx_data = tx.input;

      let res = web3.utils.toAscii(tx_data.slice(0, 2) + tx_data.substring(10));

      let re = /{.*}/g;
      res = res.match(re)[0];
      res = JSON.parse(res);
      // console.log(res);
      // await setPatInfo(res);
      // console.log(patInfo);
      console.log("res inside report ....", res.Hash);
      setReportLink(res.Hash);

      // return res.Hash;
    });
  }

  const handleNumber = async (event) => {
    event.preventDefault();
    const InputDataDecoder = require("ethereum-input-data-decoder");
    const data = new FormData(event.target);

    console.log(typeof data.get("index"));
    var idx = data.get("index"); //change to parsestring...
    setPatID(idx);
    // console.log(typeof idx);
    // console.log(this.state);
    // const h = await this.simpleStorageInstance.getHash(idx, {
    //   from: this.state.account,
    // });
    fetch(`http://localhost:8080/patient/${idx}`)
      .then((response) => response.json())
      .then(async (data) => {
        // pblocks = data.result.pblocks;
        setPblocks(data.result.blocks);
        console.log(pblocks);
        let ccc = await getUsers(pblocks);
        setPatList(ccc);
        console.log("PatList.......", patList);
      });

    fetch(`http://localhost:8080/patientreport/${idx}`)
      .then((response) => response.json())
      .then(async (data) => {
        await getReport(data.result.blocks);
        console.log("repppp", reportLink);
      });

    setShow(true);
  };

  return (
    <div>
      <nav className="navbar pure-menu pure-menu-horizontal">
        <h1>Query for Images</h1>
      </nav>
      <h2
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Enter Patient ID:{" "}
      </h2>
      <br />
      <br />
      <form
        style={{
          height: "10vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        onSubmit={handleNumber}
      >
        <div>
          <input id="index" name="index" type="text" />
        </div>
        <div>
          <input type="submit" />
        </div>
        <br />
      </form>

      {show ? <Popup value={patList} /> : null}
    </div>
  );
};

export default Preferences;
