import React, { Component } from "react";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import getWeb3 from "../../getWeb3";

import ipfs from "../../ipfs";

const { abi } = require("../../contracts/Migrations.json");
// eslint-disable-next-line
class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipfsHash: "",
      web3: null,
      contract: null,
      buffer: null,
      account: null,
      idx: 0,
      resHash: "",
      imageURL: "",
    };
    this.handleUploadPdf = this.handleUploadPdf.bind(this);
  }

  // async componentDidMount() {
  //   // Get network provider and web3 instance.
  //   // See utils/getWeb3 for more info.
  //   try {
  //     let result = await getWeb3();
  //     console.log("res", result);
  //     this.setState({ web3: result }, () => {
  //       this.instantiateContract();
  //     });
  //     console.log("web3", this.state.web3);
  //     // Instantiate contract once web3 provided.
  //     // this.instantiateContract();
  //     console.log("after inst");
  //   } catch (err) {
  //     console.log("Error finding web3.");
  //   }

  //   // getWeb3
  //   //   .then((results) => {
  //   //     this.setState({
  //   //       web3: results.web3,
  //   //     });

  //   //     // Instantiate contract once web3 provided.
  //   //     this.instantiateContract();
  //   //   })
  //   //   .catch(() => {
  //   //     console.log("Error finding web3.");
  //   //   });
  // }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then((results) => {
        this.setState({
          web3: results.web3,
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
        // this.instantiateContractNew();
        console.log("accoubnt", this.state.account);
        console.log("web3bbb", this.state.web3);
        console.log("abi", abi);
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  // instantiateContract() {
  //   /*
  //    * SMART CONTRACT EXAMPLE
  //    *
  //    * Normally these functions would be called in the context of a
  //    * state management library, but for convenience I've placed them here.
  //    */

  //   const contract = require("@truffle/contract");
  //   console.log("aftr req");
  //   const simpleStorage = contract(SimpleStorageContract);
  //   console.log("aftr contrct");
  //   console.log("web3", this.state.web3);
  //   simpleStorage.setProvider(this.state.web3.currentProvider);
  //   console.log("aftr setprov");
  //   // Get accounts.
  //   this.state.web3.eth.getAccounts((error, accounts) => {
  //     simpleStorage
  //       .deployed()
  //       .then((instance) => {
  //         this.simpleStorageInstance = instance;
  //         this.setState({ account: accounts[0] });
  //         // Get the value from the contract to prove it worked.
  //         return this.simpleStorageInstance.get.call(accounts[0]);
  //       })
  //       .then((ipfsHash) => {
  //         // Update state with the result.
  //         return this.setState({ ipfsHash });
  //       });
  //   });
  // }

  instantiateContract = async () => {
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
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Get accounts.
    const accounts = await this.state.web3.eth.getAccounts();
    console.log("accounts1", accounts);
    simpleStorage
      .deployed()
      .then((instance) => {
        this.simpleStorageInstance = instance;
        console.log("this.simpl", this.simpleStorageInstance);
        console.log("accounts", accounts);
        this.setState({ account: accounts[0] });
        console.log("account", this.state.account);

        return this.simpleStorageInstance.get.call(accounts[0]);
      })
      .then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash });
      });
  };

  handleUploadPdf(ev) {
    ev.preventDefault();

    let pid = "";
    let temp = "";
    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    data.append("filename", this.fileName.value);
    console.log(data.get("filename"));

    fetch("http://localhost:8080/report", {
      method: "POST",
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        console.log(body);
        pid = body.Patient_ID;
        temp = JSON.stringify(body);
        console.log(typeof JSON.stringify(body));
        this.simpleStorageInstance
          .set(JSON.stringify(body), { from: this.state.account })
          .then(async (r) => {
            this.state.web3.eth.getBlockNumber().then((block) => {
              console.log("latest block:.......", block);
              console.log("pid....", typeof pid);
              const pdata = { pid: pid, block: block };

              fetch(`http://localhost:8080/patientreport`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(pdata),
              }).then((response) => console.log(response));
            });

            return this.setState({ ipfsHash: temp });
          });
      });
    });
  }

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="Dashboard">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <h1>Upload Patient's Report </h1>
        </nav>

        <h2>Upload Patient's Report</h2>

        <br />
        <br />

        <form onSubmit={this.handleUploadPdf}>
          <div>
            <input
              ref={(ref) => {
                this.uploadInput = ref;
              }}
              type="file"
            />
          </div>
          <div>
            <input
              ref={(ref) => {
                this.fileName = ref;
              }}
              type="text"
              placeholder="Enter the desired name of file"
            />
          </div>
          <br />
          <div>
            <button>Upload</button>
          </div>
          {/* <img src={this.state.imageURL} alt="img" /> */}
        </form>
      </div>
    );
  }
}

export default Report;
