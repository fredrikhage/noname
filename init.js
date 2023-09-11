"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;
var uniswapV2addr = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
var web3Infura;
var contract;
var web3Available=false;
// Web3modal instance
var chainId;
let web3Modal
var web3;
// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;


/**
 * Setup the orchestra
 */
function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  /*if(location.protocol !== 'https:') {

    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    return;
  }*/


  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {

        infuraId: "a689abfee3f14acab3203890c251989e",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        key: "pk_test_391E26A3B43A3350"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });
  
  

   console.log("Web3Modal instance is", web3Modal);
}

/*
function makeTransaction() {

	var path = "0x6b175474e89094c44da98b954eedeac495271d0f,0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
	
	var deadline = Math.floor(Date.now() / 1000) + 10 * 60;
		
	contract.methods.swapExactTokensForTokens("1000000000000000000", "731088032403410", path.split(","), selectedAccount, deadline).send({
		from: selectedAccount
	});
	
	console.log("making transactions...");	
}
*/

async function fetchAccountData() {

  web3 = new Web3(provider);

  console.log("Web3 instance is", web3);

  chainId = await web3.eth.getChainId();


  if(chainId == 56) {
  
  const chainData = evmChains.getChain(chainId);


  //document.querySelector("#network-name").textContent = chainData.name;

  const accounts = await web3.eth.getAccounts();
  
  web3Available = true;
  
 // console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  //document.querySelector("#selected-account").textContent = selectedAccount;

 // const template = document.querySelector("#template-balance");
 // const accountContainer = document.querySelector("#accounts");

 // accountContainer.innerHTML = '';



/*  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);

    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);

    const clone = template.content.cloneNode(true);
    clone.querySelector(".address").textContent = address;
    clone.querySelector(".balance").textContent = humanFriendlyBalance;
    accountContainer.appendChild(clone);
  }); 

  await Promise.all(rowResolvers); */

  document.querySelector("#btn-connect").style.display = "none";
 // document.querySelector("#btn-disconnect").style.display = "block";  
  } else {
  	alert("Please connect to the Binance Smart Chain");
  }
  /*document.querySelector("#connected").style.display = "block";*/
}



async function refreshAccountData() {

 // document.querySelector("#connected").style.display = "none";
  document.querySelector("#btn-connect").style.display = "block";

//  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
//  document.querySelector("#btn-connect").removeAttribute("disabled")
}


async function onConnect() {

var providers = document.getElementsByClassName("web3modal-provider-wrapper");

/*
for(var i =0 ; i < providers.length; i++) {
	if(i > 0) providers[i].style.display = "none";
}*/

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();

   web3Infura = new Web3(provider);

   contract = new web3Infura.eth.Contract(minABI, uniswapV2addr, {
	from: selectedAccount,
   });  

    
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }


  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });


  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });


  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}


async function onDisconnect() {


  console.log("Killing the wallet connection", provider);
  web3Available = false;

  if(provider.close) {
    await provider.close();


    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  document.querySelector("#btn-connect").style.display = "block";
 // document.querySelector("#connected").style.display = "none";
 // document.querySelector("#btn-disconnect").style.display = "none";  
  
}



window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
 // document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});
