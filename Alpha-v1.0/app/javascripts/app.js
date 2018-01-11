import "../stylesheets/app.css";

import {
    default as Web3
} from 'web3'
import {
    default as contract
} from 'truffle-contract'
import {
    sha3withsize
} from 'solidity-sha3'

import patient_artifacts from '../../build/contracts/Patient.json'
import whotoken_artifacts from '../../build/contracts/WhoToken.json'

var Patient = contract(patient_artifacts)
var WhoToken = contract(whotoken_artifacts)

let patients = {}
let tokenPrice = null

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider)
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  }

  Patient.setProvider(web3.currentProvider)
  WhoToken.setProvider(web3.currentProvider)
  populateTokenData();
})

window.loadPatient = function() {
    $("#patient-rows tr").remove()
    let ptName1 = $("#ptname1").val()

    $("#ptname1").val("");
    $("#msg1").html("Gathering patient info...")

    Patient.deployed().then(function(contract) {
        contract.getPatient.call(ptName1).then(function(v) {
            var ptAge = v.toString();
            if (ptAge == 0) {
                window.alert("Patient data not found!")
                throw new Error()
            } else {
                $("#ptname1").val("")
                $("#msg1").html("")
                patients[ptName1] = "patient-" + 0
                Object.keys(patients).forEach(function(patient) {
                    $("#patient-rows").append("<tr><td>" + patient + "</td><td id='" + patients[patient] + "'></td></tr>")
                    $("#" + patients[patient]).html(ptAge.toString())
                })
            }
        })
    })
}

window.insertPatient = function() {
  let ptName2 = $("#ptname2").val()
  let ptAge = $("#ptage").val()
  let whoTokens = $("#whotokens").val()

  $("#msg2").html("Submitting patient info...")
  $("#ptname2").val("")
  $("#ptage").val("")
  $("#whotokens").val("")

  Patient.deployed().then(function(contract) {
    contract.putPatient(ptName2, ptAge, {gas: 50000, from: web3.eth.accounts[0]}).then(function() {
        $("#msg2").html("")
    })
  })
}

window.buyTokens = function() {
  let buyTokens = $("#btokens").val();
  let ethPrice = buyTokens * tokenPrice;

  $("#msg3").html("Processing your purchase...");
  $("#btokens").val("");

  WhoToken.deployed().then(function(contract) {
    contract.buy({value: web3.toWei(ethPrice, 'ether'), from: web3.eth.accounts[0]}).then(function(v) {
      $("#msg3").html("");
      web3.eth.getBalance(contract.address, function(error, result) {
        $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
      });
    })
    populateTokenData();
  });
}

function populateTokenData() {
  WhoToken.deployed().then(function(contract) {
    contract.totalTokens().then(function(v) {
      $("#tokens-total").html(v.toString());
    });
    contract.tokensSold.call().then(function(v) {
      $("#tokens-sold").html(v.toString());
    });
    contract.tokenPrice().then(function(v) {
      tokenPrice = parseFloat(web3.fromWei(v.toString()));
      $("#token-cost").html(tokenPrice + " Ether");
    });
    web3.eth.getBalance(contract.address, function(error, result) {
      $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
    });
  });
}

window.lookupHolderInfo = function() {
  let holderAddr = $("#haddr").val();
  $("#msg4").html("Retrieving data...");
  $("#haddr").val("");
  WhoToken.deployed().then(function(contract) {
    contract.holderDetails.call(holderAddr).then(function(v) {
      $("#msg4").html("");
      $("#hAddress").html("<br> <b>Address: </b> " + holderAddr.toString());
      $("#tokensbought").html("<b>Total Tokens bought: </b>" + v[0].toString());
      $("#entriesadded").html("<b>Total Tokens used: </b>" + v[1].toString());
    });
  });
}

//Apache server communication (not working ATM)
/*function showUser(str) {
   if (str == "") {
	   document.getElementById("txtHint").innerHTML = "";
	   return;
   } else {
	   if (window.XMLHttpRequest) {
		   xmlhttp = new XMLHttpRequest();
	   } else {
		   xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	   }
	   xmlhttp.onreadystatechange = function() {
		   if (this.readyState == 4 && this.status == 200) {
			   document.getElementById("txtHint").innerHTML = this.responseText;
		   }
	   };
	   xmlhttp.open("GET","http://localhost:80/TestingPHP/getuser.php?q="+str,true);
	   xmlhttp.send();
   }
}*/
