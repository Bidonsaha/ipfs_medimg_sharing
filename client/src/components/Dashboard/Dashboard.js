import React, { Component } from "react";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import getWeb3 from "../../getWeb3";

import "./Dashboard.css";

import ipfs from "../../ipfs";

const { abi } = require("../../contracts/Migrations.json");
// eslint-disable-next-line
class Dashboard extends Component {
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
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
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

  instantiateContractNew = async () => {
    try {
      const accounts = await this.state.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.state.web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new this.state.web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      // this.setState({ web3, accounts, contract: instance });
      console.log("instance", instance);
    } catch (err) {
      console.error(err);
    }
  };

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

        // this.simpleStorageInstance.print.call(this.state.account).then(console.log);

        // Get the value from the contract to prove it worked.
        // console.log(
        //   "proof",
        //   this.simpleStorageInstance.get.call(this.state.account)
        // );
        return this.simpleStorageInstance.get.call(accounts[0]);
      })
      .then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash });
      });

    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage
    //     .deployed()
    //     .then((instance) => {
    //       this.simpleStorageInstance = instance;
    //       console.log("this.simpl", this.simpleStorageInstance);
    //       console.log("accounts", accounts);
    //       this.setState({ account: accounts[0] });
    //       // Get the value from the contract to prove it worked.
    //       return this.simpleStorageInstance.get.call(accounts[0]);
    //     })
    //     .then((ipfsHash) => {
    //       // Update state with the result.
    //       return this.setState({ ipfsHash });
    //     });
    // });
  };

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    //get the png image here
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    let pid = "";
    let temp = "";
    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    data.append("filename", this.fileName.value);

    fetch("http://localhost:8080/upload", {
      method: "POST",
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        console.log(body);
        pid = body.Patient_ID;
        console.log(typeof body);
        temp = JSON.stringify(body);
        console.log(typeof JSON.stringify(body));
        this.simpleStorageInstance
          .set(JSON.stringify(body), { from: this.state.account })
          .then(async (r) => {
            this.state.web3.eth.getBlockNumber().then((block) => {
              console.log("latest block:.......", block);
              console.log("pid....", typeof pid);
              const pdata = { pid: pid, block: block };

              fetch(`http://localhost:8080/patient`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(pdata),
              }).then((response) => console.log(response));
            });
            // this.state.web3.eth.getTransaction(
            //   temp.transactions[0],
            //   async (err, tx) => {
            //     console.log("tx", tx);
            //     let tx_data = tx.input;
            //     // let input_data = "0x" + tx_data.slice(10); // get only data without function selector
            //     // console.log("inisnde gettx func input data", input_data);
            //     // let ress = this.state.web3.utils.toString(input_data);
            //     // console.log("resss", String(ress));
            //     console.log("tx_input", tx_data.length);
            //     // const decoder = new InputDataDecoder(abi);
            //     // const resss = decoder.decodeData(tx_data);

            //     // console.log("resss", resss);
            //   }
            // );

            // console.log("outside gettxxxx", this.state.web3);
            // console.log("ifpsHash", this.state.ipfsHash);
            // console.log("ifpsHash", result);
            // console.log("ifpsHash", result[0].hash);
            // this.getBlock();
            return this.setState({ ipfsHash: temp });
          });
      });
    });

    // can call blockchain here
  }

  onSubmit(event) {
    event.preventDefault();
    const InputDataDecoder = require("ethereum-input-data-decoder");
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log("result", result);
      console.log("account", this.state.account);
      this.simpleStorageInstance
        .set(result[0].hash, { from: this.state.account })
        .then(async (r) => {
          const n = await this.simpleStorageInstance.print.call();
          console.log(n.words[0]);
          const h = await this.simpleStorageInstance.getHash(3, {
            from: this.state.account,
          });
          const a_r = await this.simpleStorageInstance.getHashArr(0, {
            from: this.state.account,
          });
          console.log("h", h);
          console.log("a_r", a_r);
          console.log("Block 25:");
          let temp = await this.state.web3.eth.getBlock(168);
          console.log(temp);
          console.log("outisde gettx func", this.state.web3);

          this.state.web3.eth.getTransaction(
            temp.transactions[0],
            async (err, tx) => {
              console.log("tx", tx);
              let tx_data = tx.input;
              // let input_data = "0x" + tx_data.slice(10); // get only data without function selector
              // console.log("inisnde gettx func input data", input_data);
              // let ress = this.state.web3.utils.toString(input_data);
              // console.log("resss", String(ress));
              console.log("tx_input", tx_data.length);
              // const decoder = new InputDataDecoder(abi);
              // const resss = decoder.decodeData(tx_data);

              // console.log("resss", resss);
            }
          );

          console.log("outside gettxxxx", this.state.web3);
          // console.log("ifpsHash", this.state.ipfsHash);
          // console.log("ifpsHash", result);
          // console.log("ifpsHash", result[0].hash);
          // this.getBlock();
          return this.setState({ ipfsHash: result[0].hash });
        });
    });
  }

  async handleNumber(event) {
    event.preventDefault();
    const InputDataDecoder = require("ethereum-input-data-decoder");
    const data = new FormData(event.target);

    console.log(typeof data.get("index"));
    var idx = parseInt(data.get("index"));
    // console.log(typeof idx);
    // console.log(this.state);
    // const h = await this.simpleStorageInstance.getHash(idx, {
    //   from: this.state.account,
    // });
    let temp = await this.state.web3.eth.getBlock(idx);
    console.log(temp);
    this.state.web3.eth.getTransaction(
      temp.transactions[0],
      async (err, tx) => {
        console.log("tx", tx);
        let tx_data = tx.input;
        // let input_data = "0x" + tx_data.slice(10); // get only data without function selector
        // console.log("inisnde gettx func input data", input_data);
        // let ress = this.state.web3.utils.toString(input_data);
        // console.log("resss", String(ress));
        console.log("tx_input_len", tx_data.length);
        console.log("tx_input", tx_data);
        let res = this.state.web3.utils.toAscii(
          tx_data.slice(0, 2) + tx_data.substring(10)
        );
        let i = res.indexOf(".");
        res = res.substring(i + 1, i + 47);
        this.setState({ resHash: res });
        console.log(res);
      }
    );
    // console.log(h);
  }

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="Dashboard">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <h1>IPFS File Upload DApp</h1>
        </nav>

        <h2>Upload Image</h2>

        <br />
        <br />

        <form onSubmit={this.handleUploadImage}>
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

export default Dashboard;
