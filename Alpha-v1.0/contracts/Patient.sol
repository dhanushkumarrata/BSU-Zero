pragma solidity ^0.4.18;

contract Patient {

  struct patient {
    uint age;
  }

  mapping (bytes32 => patient) public patientInfo;

  function putPatient(bytes32 pName, uint pAge) public {
    patientInfo[pName].age = pAge;
  }

  function getPatient(bytes32 _pName) public returns (uint) {
      return patientInfo[_pName].age;
  }

}
