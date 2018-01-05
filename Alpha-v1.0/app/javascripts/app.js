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
import whotoken_artifacts from '../..build/contracts/WhoToken.json'

var Patient = contract(patient_artifacts)
var WhoToken = contract(whotoken_artifacts)

let patients = {}
let tokenPrice = null

window.loadPatient = function() {
    let ptName = $("#ptname").val()

    $("#ptname").val("");

    /*Patient.deployed().then(function(contract) {
        contract.getAddress.call(ballotID).then(function(v) {
            var votingAddress = v.toString();
            if (votingAddress == 0) {
                window.alert("Invalid ballot ID!")
                //$("#msg4").html("Invalid ballot ID!")
                throw new Error()
            } else {
                $("#msg4").html("Setting up ballot...")
                $("#ballotid").val("")
                getCandidates(votingAddress, ballotID)
            }
        })
    })*/

}

window.insertNewPatient = function() {
  let ptName = $("#ptname").val()
  let ptAge = $("#ptage").val()
  let whoTokens = $("#whotokens").val()

  $("#msg2").html("Gathering patient info...")
  $("#ptname").val("")
  $("#ptage").val("")
  $("#whotokens").val("")

  /*Patient.deployed().then(function(contractInstance) {
    contractInstance.voteForCandidate(candidateName, voteTokens, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
      let div_id = candidates[candidateName];
      return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
        $("#" + div_id).html(v.toString());
        $("#msg").html("");
      });
    });
});*/

}

window.buyTokens = function() {
  let buyTokens = $("#btokens").val();
  let ethPrice = buyTokens * tokenPrice;

  $("#msg3").html("Processing your purchase...");

  /*WhoToken.deployed().then(function(contractInstance) {
    contractInstance.buy({value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0]}).then(function(v) {
      $("#msg3").html("");
      web3.eth.getBalance(contractInstance.address, function(error, result) {
        $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
      });
    })
  });
  populateTokenData();*/

}

window.lookupHolderInfo = function() {
  let holderAddr = $("#haddr").val();

  /*WhoToken.deployed().then(function(contractInstance) {
    contractInstance.voterDetails.call(address).then(function(v) {
      $("#tokensbought").html("Total Tokens bought: " + v[0].toString());
      let votesPerCandidate = v[1];
      $("#entiresadded").empty();
      $("#entriesadded").append("New patient entires: <br>");
      let allCandidates = Object.keys(candidates);
      for(let i=0; i < allCandidates.length; i++) {
        $("#entiresadded").append(allCandidates[i] + ": " + votesPerCandidate[i] + "<br>");
      }
    });
});*/

}

function setupCandidateRows() {
  Object.keys(candidates).forEach(function (candidate) {
    $("#patient-rows").append("<tr><td>" + candidate + "</td><td id='" + candidates[candidate] + "'></td></tr>");
  });
}

function populateTokenData() {
  WhoToken.deployed().then(function(contractInstance) {
    contractInstance.totalTokens().then(function(v) {
      $("#tokens-total").html(v.toString());
    });
    contractInstance.tokensSold.call().then(function(v) {
      $("#tokens-sold").html(v.toString());
    });
    contractInstance.tokenPrice().then(function(v) {
      tokenPrice = parseFloat(web3.fromWei(v.toString()));
      $("#token-cost").html(tokenPrice + " Ether");
    });
    web3.eth.getBalance(contractInstance.address, function(error, result) {
      $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
    });
  });
}

function populateCandidates() {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.allCandidates.call().then(function(candidateArray) {
      for(let i=0; i < candidateArray.length; i++) {
        candidates[web3.toUtf8(candidateArray[i])] = "candidate-" + i;
      }
      setupCandidateRows();
      populateCandidateVotes();
      populateTokenData();
    });
  });
}

function populateCandidateVotes() {
  let candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    Voting.deployed().then(function(contractInstance) {
      contractInstance.totalVotesFor.call(name).then(function(v) {
        $("#" + candidates[name]).html(v.toString());
      });
    });
  }
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider)
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  }

  Patient.setProvider(web3.currentProvider)
  WhoToken.setProvider(web3.currentProvider)
})

//Apache server communication (not working ATM)
function showUser(str) {
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
}
