var chainId = 0;
var contract, metamaskConnection = false;
var maxPriceImpact = 10;
var lastAdd = 0;
var inputSelected = true;
const ValidChainId = 56;
var jsonData;


const defaultList = getDefaultList();

const urlParams = new URLSearchParams(window.location.search);
const param1 = urlParams.get('input'); 
const param2 = urlParams.get('output'); 
const param3 = urlParams.get('data');

if(param3 !== null) {
  	jsonData = decodeAndDecompressJSON(param3);
  
	var tickers = [];

	for (var key in defaultList) {
	  if (defaultList.hasOwnProperty(key)) {
	    var ticker = defaultList[key].ticker;
	    tickers.push(ticker);
	  }
	}

	for (var key in jsonData) {
	    if (jsonData.hasOwnProperty(key)) {
	   	 var ticker = jsonData[key].ticker;
	   	 if(!whiteListed(key) && tickers.includes(ticker)) {
	   		 jsonData[key].ticker = "?" + ticker;
	   	 }
	    }	
	}

  	
} else {
	jsonData = defaultList;
}

function removeSpecialCharacters(inputString) {
	const noSpecialChars = inputString.replace(/[^a-zA-Z0-9 /.",{}:]/g, '');
	return noSpecialChars;
}

function myTrim(inputString) {
	const trimmedString = inputString.trim();
	const stringWithoutLineBreaks = trimmedString.replace(/[\r\n]+/g, '');
	var final = stringWithoutLineBreaks.replace(/\t/g, '');
	return removeSpecialCharacters(final);
}	
	
initDex();


function compressAndEncodeJSON(data) {
	const jsonString = JSON.stringify(data);
	const compressedData = LZString.compressToBase64(jsonString);
	const encodedData = encodeURIComponent(compressedData);
	return encodedData;
}

function decodeAndDecompressJSON(data) {
	const decodedData = decodeURIComponent(data);
	const decompressedData = LZString.decompressFromBase64(decodedData);
	var inputString = myTrim(decompressedData);
	if(inputString.startsWith('"') && inputString.endsWith('"')) {
		inputString = inputString.substring(1, inputString.length - 1);
	}
	return JSON.parse(inputString);
}


function getDefaultList() {
	var data = "N4IgDAHg7FYEwBMBiBWAjATgwgHAYwGYAhAFgFEocBhMKANjACMARMJKuAvfJsKtHCABcoAC4BLPAGsApgCdhIADIANAIIBVEABoQAOwCGAWxmKlAez0BzAAQBxcwBsENgCrnZenSACucx4pWeuYmjgaMAM4AdAgyAG4A9I4QBj7esXjiRgaOEcICuhGO4gAOJQZWpkJgUWBgKLrl4gpC4BAkAGYE5JgyavU4cHB0cGh0KAbDKMx0JDITGHSwUChQ3EQEIAC%2BupCMYARQWOyL%2B2gG9SQjjDJwdXwYVwRgamQGJPg4YGjCYpKyLWURFcVG8hhMZkstiI4lEeHM4j0bg8Mi8uj8AVaQRCMjCkRi8SSjDh6RkmWyuXyOEKxTKFSqNTqDRATUBkE63TIvX6KEGw1G40m4xmcwWS1oq3Wmx2bUYcCIdDUcBgKBQYBk3wuOAwBDQZDgjDWBBQZCQqBIVHGRH6jEEIhAEmk8kUAGVgaDdOCqiAXQALcxyUQ2GFwhFI9yebwYwLBULhaKxRIRYl4UnknJ5IQFEBFUrlSrCRn1RoGZqKdldHoYPoDIYjMYTKYi%2BYGRbLSU4DbbXYQc5dLpwas4G5oFAkWgkXD0bBoDodd4yDW8xhoBCMQi%2FB3%2FZ2tZhqACSYOM3uYpbTWQzVJpefphZlkFVCAIGBwBGGHSw9Qwc5VHxQcCuLAMHgKBGF1DAjlVTdHQBRQNBdZhXCPCFWlcGRRF9Z1dAyC9KSzakc1pfMGXvCAZGrKAqDINQCGYGQEDwNQUBfEhKDAIgDA6PBmIwFg6AwNRmAQMAcCgZgUDoaDt0BIh4OYZDvRhQw9DwGQbDk88KUzbNczpAtqlInADDwegDHQPA8AwNUEBfIYEDoYdXw6GRzhs0C3zwBBeTABApKdQE5I9fRjzghCbHhRFNMvfDrz0kiezAPzYNaIgADkiAUxQlIMFS1KoMMorwnSiNvAye0YRgSE8xgMDwRgnzoM56rQOqDBkRgOkQDUcBstAoAIdcwCs1N7RgncQAAdTSjLPRC1oJrkAwyno4N0sK7SCN04i7x7KA0GeBA4DUNB5QwIgqEYJA1BkTphm6XBZmOsgXKoGQCDeGyRr%2BfyspBTKUthCK0RAHCtKvQib30sASzLVo9kq6ravqghGu%2BZrWvazrYhE3r%2BsG4buzaUZYDIYScC%2BYyBJWFAOkOs7hnJqy6CIZgrIwJAdQIJA7W%2B5KQDIVwAAl%2Fv5jD5BkHwjHW8GttK6GWVLNkIAqqq1yRhqmoQFrGDajqupxjA%2BoGvAhpQVNSI5Ksa15OsBUbYVZhbNsJTWTtNlG6TFDsAAlJDZpQkAfb93x%2FBjHE8QTQkrEDaWYohuLCxhpW%2BwIAchxHMcJynfitbnBcl2HVd12lLYgA%3D";
	return decodeAndDecompressJSON(data);
}


function initDex() {
	if(param1 !== null && param2 !== null) {
		const ticker1 = jsonData[myTrim(param1)].ticker;
		const ticker2 = jsonData[myTrim(param2)].ticker;
		if(ticker1 !== undefined && ticker2 !== undefined) { 
			document.getElementById("uni_inputSelect").setAttribute('data-contract', param1);
			document.getElementById("uni_outputSelect").setAttribute('data-contract', param2);
			document.getElementById("inputTicker").innerHTML = ticker1;
			document.getElementById("outputTicker").innerHTML = ticker2;	
		}	
	}

	var tokenListHtml = "<div id='uni_close'>x</div><h1>Select Input: </h1>";
	var prices = [];

	for (const key in jsonData) {
		if (jsonData.hasOwnProperty(key)) {
			const ticker = jsonData[key]["ticker"]; 
			const name = jsonData[key]["name"];
			const url = jsonData[key]["url"];    
			const firstLetter = ticker[0];
		    	var contract = key;
		    	if(contract == "0x0") contract = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
		    
			tokenListHtml += "<tr class='tokenRow' data-contract='"+contract+"'><td style='width: 72vw;max-width: 541px;' >";
			tokenListHtml += " <span onclick='selectInput(\""+ticker+"\", \""+contract+"\")'>" + name + " (" + ticker + ")</span> ";
			if (url !== undefined && url.includes("gnomelabs") && (firstLetter == "L" || firstLetter == "S") && whiteListed(key)) {
				tokenListHtml += "<span class='gradanimate'> synth </span> ";
			}
			
			tokenListHtml += "<div id='edit'></div>";			
			tokenListHtml += "</td>";
			
			if(url !== undefined) {
				tokenListHtml += "<td><a style='text-decoration:none;' href='https://"+url+"'><span class='tokenInfo'>Info</span></a></td>";
			}
			

			tokenListHtml += "</tr>";
		}
	}

	var importMenu = "";
/*
	var importMenu = "<input type='textfield' name='contract' placeholder='contract(0x...)'/><br/>"; 
	importMenu += "<input type='textfield' name='name' placeholder='name'/><br/>";
	importMenu += "<input type='textfield' name='ticker' placeholder='ticker'/><br/>";
	importMenu += "<input type='textfield' name='decimals' placeholder='number of decimals'/><br/>";
	importMenu += "<input type='textfield' name='slippage' placeholder='slippage'/><br/>";	
	importMenu += "<span style='font-size:10px;'>What token is it mainly traded against? </span><br/><input type='textfield' name='pair' placeholder='contract(0x...)'/><br/>";	
	importMenu += "<input type='submit' name='submit' value='save'/><br/>";	
	importMenu = '<details> <summary style="color:gray; font-size:12px;">Import custom token</summary><p style="margin-top:20px; padding-bottom:50px;">'+importMenu+'</p></details>';
*/
	document.getElementById("tokenListHolder").innerHTML = "<table style='width:100%;margin-top:45px;'>" + tokenListHtml + "</table><div>" +importMenu+"</div>";
	
}



document.getElementById("arrow").addEventListener("click", function() {
	var inputTicker = getInputTicker();
	var outputTicker = getOutputTicker();	
	var inputContract = getInputContract();
	var outputContract = getOutputContract();		
	
	document.getElementById("outputTicker").innerHTML = inputTicker;
	document.getElementById("inputTicker").innerHTML = outputTicker;	
		
	document.getElementById("uni_inputSelect").setAttribute("data-contract", outputContract);
	document.getElementById("uni_outputSelect").setAttribute("data-contract", inputContract);

	var inputAmount = getInputAmount();
	var outputAmount = getOutputAmount();
	
	document.getElementById('uni_inputTextField').value = outputAmount;
	document.getElementById('uni_outputTextField').value = "";
	
	updateUi();		

});

function getMaxTokenInput() {
	return document.getElementById("availableTokens").getAttribute("data-available");
}

function getMaxAllow() {
	return document.getElementById("availableTokens").getAttribute("data-maxallowance");
}

function getDecimalsFromContract(contract) {
	return jsonData[contract].decimals;
}

function getInputContract() {
	return document.getElementById("uni_inputSelect").getAttribute("data-contract");
}

function getOutputContract() {
	return document.getElementById("uni_outputSelect").getAttribute("data-contract");
}

function getInputTicker() {
	return document.getElementById("inputTicker").innerHTML;
}

function getOutputTicker() {
	return document.getElementById("outputTicker").innerHTML;
}

function getInputSlippage() {
	return 1 * jsonData[getInputContract()].slippage;
}

function getOutputSlippage() {
	return 1 * jsonData[getOutputContract()].slippage;
}

function getInputAmount() {
	return document.getElementById("uni_inputTextField").value;
}

function getOutputAmount() {
	return document.getElementById("uni_outputTextField").value;
}


function getInputAmountInWeis() {
	return bigMul(getInputAmount(), getDecimalsFromContract(getInputContract()));
}

document.getElementById("uni_max").addEventListener("click", function() {
	document.getElementById("uni_inputTextField").value = getMaxTokenInput() ;
});


document.getElementById("uni_wrap").addEventListener("click", function() {
	alert("This feature will be available soon");
});

document.getElementById("uni_unwrap").addEventListener("click", function() {
	alert("This feature will be available soon");
});


function showElement(elem) {
	if(elem !== null) {
		elem.style.display = 'block';
	}
}

function hideElement(elem) {
	if(elem !== null) {
		elem.style.display = 'none';
	}
}


document.getElementsByTagName("body")[0].addEventListener("click", function() {
	setTimeout(updateUi, 200);	
});


document.getElementsByTagName("body")[0].addEventListener("keydown", function() {
	setTimeout(updateUi, 200);	
});

function approveLpSpending() {
	if(metamaskConnection) {
		var tokenAddr = getInputContract();	
		var tmpContract = new web3Infura.eth.Contract(erc20minabi, tokenAddr, { from: selectedAccount});
		tmpContract.options.address = tokenAddr;	

		if(tokenAddr.length == 42) {
			tmpContract.methods.approve(uniswapV2addr,"115792089237316195423570985008687907853269984665640564039457584007913129639935").send({
				from: selectedAccount
			});		
		} else {
			console.log("Could not read address.");
		}
	} else {
		alert("You are not connected to Metamask.");
	}
	event.stopPropagation();
}


function setMaxAllowance(contractAddress) {
	var tmpContract = new web3Infura.eth.Contract(erc20minabi, contractAddress, { from: selectedAccount});
	tmpContract.options.address = contractAddress;	
	tmpContract.methods.allowance(selectedAccount, uniswapV2addr).call({},(err, res) => {		
		if(!err){
			if(res > 0) {
				var nDecimals = getDecimalsFromContract(getInputContract());
				var maxAllowance = divBigInt(res, nDecimals);
				document.getElementById("availableTokens").setAttribute("data-maxAllowance", maxAllowance);  	
			} else {
				document.getElementById("availableTokens").setAttribute("data-maxAllowance", 0);				
			}
		} else {
			console.log(err);
		}
	});	

}



function updateAvailable() {
	var contractAddress = getInputContract();
	var tmpContract = new web3Infura.eth.Contract(erc20minabi, contractAddress, { from: selectedAccount});
	tmpContract.options.address = contractAddress;	
	
	var setAvailableTokens = function (res) {
		if(res.length > 1) {
			var nDecimals  = getDecimalsFromContract(getInputContract());	
			var outputAvaibleTokens = divBigInt(res, nDecimals);
			document.getElementById("availableTokens").setAttribute("data-available", outputAvaibleTokens);		
			outputAvaibleTokens = numberWithCommas((1*outputAvaibleTokens).toFixed(5)).toString();			
			if(outputAvaibleTokens.length > 15) {
				outputAvaibleTokens = outputAvaibleTokens.slice(0, -(outputAvaibleTokens.length - 15));
			}				
			document.getElementById("availableTokens").innerHTML = outputAvaibleTokens;								
			showElement(document.getElementById("availablemax"));	
		
		 } else {
			document.getElementById("availableTokens").innerHTML = 0;					
			showElement(document.getElementById("availablemax"));				
			document.getElementById("availableTokens").setAttribute("data-available",0);	
						
		}		
	};
	
	if(getInputTicker() == "BNB") {
		web3.eth.getBalance(selectedAccount).then(bal => { setAvailableTokens(bal); });
	} else {
		tmpContract.methods.balanceOf(selectedAccount).call({},(err, res) => {		
			if(!err){
				setAvailableTokens(res);
			} else {
				console.log(err);
			}		
		});	
	}
}


function applySlippage(n, slippageAmount) {
	if(n.length > 10) {
		var i = 1000 - slippageAmount * 1000;	
		var toSubtract = BigInt(slice(n,-3));
		var bigNumber = BigInt(n);
		for(var a = 0; a < i; a++) {
			bigNumber -= toSubtract;
		}
		return bigNumber.toString();
	}
	return Math.round(n * slippageAmount).toString();
}

function getSlippage() {
	var inputSlippage = getInputSlippage();	
	var outputSlippage = getOutputSlippage();
	var slippage = (inputSlippage > outputSlippage) ? inputSlippage : outputSlippage;
	if(slippage == 0) {
		return 0.003;
	}
	return slippage;
}

function swap() {
	updateUi();
	var outputAmountMin = document.getElementById("uni_outputTextField").getAttribute("data-output");
	console.log("From:" + selectedAccount);
	
	if(metamaskConnection ) { //&& outputAmountMin !== "0"
	
	var path = getPath(getInputContract(), getOutputContract());
	console.log(path);
	path = path.split(",");	


	var finalOutputAmount;
	var deadline = Math.floor(Date.now() / 1000) + 10 * 60;
	var inputticker = getInputTicker();	
	var outputticker = getOutputTicker();
	var slippage = getSlippage();
	var priceImpact = setPriceImpact();	

	finalOutputAmount = applySlippage(outputAmountMin, (1-slippage)).toString();	
	
	
	if(priceImpact > maxPriceImpact) {
		alert("Price impact too high.");
		return;	
	}
	
	if(finalOutputAmount < 1 || priceImpact < 0) {
		alert("Something went wrong.");
		return;
	}				
	if(inputticker == "BNB" && slippage > 0) {
		console.log("swapExactETHForTokensSupportingFeeOnTransferTokens");						
		contract.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(finalOutputAmount, path, selectedAccount, deadline).send({
			value: getInputAmountInWeis(),
			from: selectedAccount
		});					
	} else if(slippage > 0.003 && outputticker == "BNB") {
		console.log("swapExactTokensForETHSupportingFeeOnTransferTokens");					
		contract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(getInputAmountInWeis(), finalOutputAmount, path, selectedAccount, deadline).send({
			from: selectedAccount
		});
	} else if(outputticker == "BNB") {
		console.log("swapExactTokensForETH");				
		contract.methods.swapExactTokensForETH(getInputAmountInWeis(), finalOutputAmount, path, selectedAccount, deadline).send({
			from: selectedAccount
		});					
	} else if(inputticker == "BNB") {
		console.log("swapExactETHForTokens");	
		contract.methods.swapExactETHForTokens(finalOutputAmount, path, selectedAccount, deadline).send({
			value: getInputAmountInWeis(), 
			from: selectedAccount
		});					
	} else if(slippage > 0.003) { 	
		console.log("swapExactTokensForTokensSupportingFeeOnTransferTokens");	
		contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(getInputAmountInWeis(), finalOutputAmount, path, selectedAccount, deadline).send({
			from: selectedAccount
		});			
	} else {
		console.log("swapExactTokensForTokens");	
		contract.methods.swapExactTokensForTokens(getInputAmountInWeis(), finalOutputAmount, path, selectedAccount, deadline).send({
			from: selectedAccount
		});		
	}		
	
	
	} else { 
		alert("You are not connected to Metamask.");
	}


}

function removeDuplicatesInARow(inputString) {
	const values = inputString.split(',');
	const result = [];
	let prevValue = null;
	for (const value of values) {
		if (value !== prevValue) {
			result.push(value);
			prevValue = value;
		}
	}
	return result.join(',');
}

function divBigInt(inputAmount,nDecimals) {
	var temp = addDotFromRight("000000000000000000000000000" + inputAmount, 1*nDecimals);
	temp = temp.replace(/^0+/, '');
	if(temp.charAt(0) == ".") return "0" + temp;
	return temp;
}

function selectInput(inputToken, inputContract) {
	if(inputSelected) {
		document.getElementById("inputTicker").innerHTML = inputToken;	
		document.getElementById("uni_inputSelect").setAttribute("data-contract", inputContract);			
		
	} else {
		document.getElementById("outputTicker").innerHTML = inputToken;	
		document.getElementById("uni_outputSelect").setAttribute("data-contract", inputContract);					
	}
	document.getElementById("uni_dropdown").style.display = "none";		
}

function shortenPath(path) {

	var removeTextBetweenWords = function (sentence, startWord) {
		var words = sentence.split(",");

		var count = 0;
		var result = [];
		for(var i = 0; i < words.length ; i++) {
			if(words[i] == startWord) {
				count++;
			} 
			
			if(count == 0 || count == 2) {
				result.push(words[i]);
			}
			
		
		}
		
		return result.join(",");
	}


	var countOcc = function (mainString, substring) {
		return mainString.split(substring).length - 1;
	}
	
	var startWord = "";

	var words = removeDuplicatesInARow(path).split(",");
	for(var i = 0; i < words.length; i++) {
		if(countOcc(path, words[i]) > 1 && startWord == "") {
			startWord = words[i];
			
		}

	}
	
	if(startWord != "") {
		return removeTextBetweenWords(path, startWord);
	}
	
	return path;
}


function develop(path) {
	var arr = path.split(",");
	var inputArr = [arr[0]];
	var outputArr = [arr[arr.length - 1]];	
	var adj;
		
	adj = inputArr[0];
	while(adj != undefined) {
		adj = jsonData[inputArr[inputArr.length - 1]].pair;	
		if(adj != undefined) { 
			inputArr.push(adj);	
		}
	}
	
	adj = outputArr[0];
	while(adj != undefined) {
		adj = jsonData[outputArr[outputArr.length - 1]].pair;	
		if(adj != undefined) { 
			outputArr.push(adj);	
		}
	}	

		
	return inputArr.join(",") + "," + outputArr.reverse().join(",");
}

function getPath(inputContract, outputContract) {
	if(inputContract == outputContract) return "error";
	return shortenPath(develop(inputContract + "," + outputContract));

}

function addDotFromRight(sentence, positionsFromRight) {
	if (typeof sentence !== 'string' || positionsFromRight <= 0 || positionsFromRight >= sentence.length) {
		return sentence;
 	}

	const dotPosition = sentence.length - positionsFromRight;
	const sentenceWithDot = sentence.substring(0, dotPosition) + '.' + sentence.substring(dotPosition);

	return sentenceWithDot;
}


function bigMul(number, decimals) {


	var moveDot = function (sentence, positions) {
		const dotIndex = sentence.indexOf('.');
		var newSentence = "";
		let newDotIndex = (dotIndex + positions + 1) % sentence.length;
		for(var i=0; i < sentence.length; i++ ) {
			if(i == dotIndex) continue;
			if(i == newDotIndex) newSentence += ".";
			newSentence += sentence.charAt(i);
		  }
		return newSentence;
	}

	var addDot = function (sentence) {
		if (!/\./.test(sentence)) {
			return sentence.trim() + '.';
		} else {
			return sentence.trim();
		}
	};

	var removeLeadingZeros = function (str) {
		const result = str.replace(/^0+/, '');
		return result;
	};

	

	sentence = addDot(number) + "000000000000000000000000000";

	var newSentence = removeLeadingZeros(moveDot(sentence, 1 * decimals).split(".")[0]);
	return newSentence;
}

function slice(n, by) {
	return parseInt(n.toString().slice(0, by));
}

function writeOutputValue(v) {
	document.getElementById("uni_outputTextField").value = (Math.round(v*100000000) / 100000000) .toString();
	if(v == 0) {
		document.getElementById("uni_outputTextField").setAttribute("data-output", "0");	
	}		
}

function findMedian(numbers) {

	numbers.sort((a ,b) => {
	  if(a > b) {
	    return 1;
	  } else if (a < b){
	    return -1;
	  } else {
	    return 0;
	  }
	});

	const length = numbers.length;
	const mid = Math.floor(length / 2);

	if (length % 2 === 0) {
		return (numbers[mid - 1] + numbers[mid]) / 2;
	} else {
		return numbers[mid];
	}
}


function setMedianPrice(amountIn, path) {
			
	if(amountIn.length > 5) {
		var smallAmount = amountIn.slice(0, -4);
		contract.methods.getAmountsOut(smallAmount, path).call({},(err, res) => {
			if(!err) {
				if(res.length > 0) {
					var outputTokens = res[res.length-1].toString();	
					var timestamp = Math.round(Date.now() / 1000); 					
					if(timestamp - lastAdd > 4 || prices.length < 3) {	
						if(prices.length > 19) prices.pop();
							prices.push(smallAmount / outputTokens);
							lastAdd = timestamp;
						}
					var newOutput = "" + (BigInt( 1000000000000 * amountIn / findMedian(prices)) /BigInt("1000000000000")).toString();
					document.getElementById("uni_outputTextField").setAttribute("data-bigoutput", newOutput);
					setPriceImpact();
				}
			} 
		});	
	}
		
}


function setOutputAmount() {
	metamaskConnection = (selectedAccount !== undefined && web3Available && chainId == ValidChainId);
	if(!metamaskConnection) return; 

	var inputAmount = getInputAmount();
		
	if(inputAmount == 0) {
		writeOutputValue(0);
		return;
	}
	
	var inputContract = getInputContract(); 
	if(inputContract == getOutputContract()) {
		var inputTicker = getInputTicker();	
		if(inputAmount > 0) {
			writeOutputValue(inputAmount);
		} else {
			writeOutputValue(0);
		}
		return;
	}
	var path = getPath(inputContract, getOutputContract());

	var amountIn = getInputAmountInWeis();

	var valid = false;
	try {	

		path = path.split(",");
		contract.methods.getAmountsOut(amountIn, path).call({},(err, res) => {
			if(!err) {
				if(res.length > 0) {
					valid = true;
					var outputTokens = res[res.length-1].toString();	
					var final = divBigInt(outputTokens, getDecimalsFromContract(getOutputContract()));					
					writeOutputValue(final);	
					document.getElementById("uni_outputTextField").setAttribute("data-output", outputTokens);	
					setMedianPrice(amountIn, path);					
				}
			} 
			
			if(!valid) {
				writeOutputValue(0);	
				document.getElementById("uni_outputTextField").setAttribute("data-output", "-1");
			}
		});	
		
		

		
		
	} catch(error) {
		console.log(error);
		writeOutputValue(0);		
	}	
	

						
}

function hideOtherButtons() {
	hideElement(document.getElementById("uni_connectButton"));	
	hideElement(document.getElementById("uni_approveButton"));
	hideElement(document.getElementById("uni_swapButton"));	
	hideElement(document.getElementById("uni_errorMessage")); 
	hideElement(document.getElementById("uni_wrap"));
	hideElement(document.getElementById("uni_unwrap"));
}

function numberWithCommas(x) {
	var parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}


function updateButtons() {
	metamaskConnection = (selectedAccount !== undefined && web3Available && chainId == ValidChainId);
	if(metamaskConnection) {
		var newTickers = getInputTicker() + getOutputTicker();
		if(newTickers != tickers) {
			prices = [];
		}
		var tickers = newTickers;
		var inputAmount = getInputAmount();	
		var availableAmountOfTokens = getMaxTokenInput();	
		var maxAllowedInput = getMaxAllow(); 
		var inputTicker = getInputTicker();
		var outputTicker = getOutputTicker();	
		var outputAmountInWeis = document.getElementById("uni_outputTextField").getAttribute("data-output");
		var priceImpact = document.getElementById("priceimpact").getAttribute("data-priceImpact");

		hideOtherButtons();
		
		if(outputAmountInWeis == "-1") {
			document.getElementById("uni_errorMessage").innerText = "No Liquidity Found";
		} else if(inputTicker == outputTicker) {
			document.getElementById("uni_errorMessage").innerText = "Not a valid pair";		
		} else if(priceImpact >= maxPriceImpact) {
			document.getElementById("uni_errorMessage").innerText = "Price Impact too high";		
		} else {
			document.getElementById("uni_errorMessage").innerText = "Enter a valid amount";		
		}


		if (tickers == "BNBWBNB") {
			showElement(document.getElementById("uni_wrap"));
		} else if (tickers == "WBNBBNB") {
			showElement(document.getElementById("uni_unwrap"));
		} else if(1*inputAmount > 1*availableAmountOfTokens || !(inputAmount > 0)) {
			showElement(document.getElementById("uni_errorMessage"));
		} else if (maxAllowedInput >= 0 && 1*inputAmount > 1*maxAllowedInput && inputTicker !== "BNB") {
			showElement(document.getElementById("uni_approveButton"));
		} else if(outputTicker !== inputTicker && getOutputAmount() > 0 && priceImpact < maxPriceImpact) {
			showElement(document.getElementById("uni_swapButton"));	
		} else {
			showElement(document.getElementById("uni_errorMessage"));
		}
	}


}


function setPriceImpact() {
	
	var elem = document.getElementById("uni_outputTextField");
	var amount = elem.getAttribute("data-output");
	var bigAmount = elem.getAttribute("data-bigoutput");
	
	if(amount == undefined || bigAmount == undefined) return -1;
	
	amount = BigInt(amount);
	bigAmount = BigInt(bigAmount);
	
	if(amount > 0 && bigAmount > 0 && bigAmount > amount) {
		var priceImpact = (Number(BigInt("1000000") * (bigAmount-amount) / bigAmount) ) / 10000;
		if(priceImpact > 100) priceImpact = 100;
		document.getElementById("priceimpact").innerHTML = "Price impact: -" + priceImpact.toFixed(2) + " %";
		document.getElementById("priceimpact").setAttribute("data-priceImpact", priceImpact);		
		return 1 * priceImpact;
	}
	document.getElementById("priceimpact").setAttribute("data-priceImpact", "-1");			
	return -1;
}

function whiteListed(contract) {
	const defaultList2 = getDefaultList();
	return defaultList2[contract] !== undefined;
}

function removeFirstTwoIfComma(str) {
	if (str.charAt(0) === ',') {
		return str.substring(2);
	} else {
		return str;
	}
}

function updateUi() {

	var inputContract = getInputContract();
	var outputContract = getOutputContract();
	
	var warning = "";
	
	if(!whiteListed(inputContract)) {
		document.getElementById("inputTicker").style.color = "red";
		warning += getInputTicker();
	} else {
		document.getElementById("inputTicker").style.color = "white";	
	}

	if(!whiteListed(outputContract)) {
		document.getElementById("outputTicker").style.color = "red";
		warning += ", " + getOutputTicker();
	} else {
		document.getElementById("outputTicker").style.color = "white";	
	}
	
	if(warning !== "") {
		
		document.getElementById("securitywarning").style.display = "block";
		document.getElementById("securitywarning").innerHTML = "Warning: some of your imported selected tokens ("+removeFirstTwoIfComma(warning)+") are unknown and could be high risk. Click <a href='/'>here</a> to remove all imported tokens.";
	}

	metamaskConnection = (selectedAccount !== undefined && web3Available && ValidChainId && jsonData !== undefined);
	if(metamaskConnection) {
		/*var output1 = document.getElementById("uni_outputTextField").getAttribute("data-output");
		var output2 = document.getElementById("uni_outputTextField").getAttribute("data-output2");
		var diff = Math.abs(Math.round(100* output1/output2));
		console.log(diff); */
		
		var inputAmount = getInputAmount();	
		updateAvailable();	

		if(inputAmount >= 0) { 
			setOutputAmount();
			if(getInputTicker() !== "BNB") {
				setMaxAllowance(inputContract);
			}
			
			document.getElementById("displaySlippage").innerHTML = (getSlippage() * 100).toFixed(2) + "%";
		} 

	} else {
		hideOtherButtons();		
		showElement(document.getElementById("uni_connectButton"));	
	}
}

document.getElementById("uni_inputSelect").addEventListener("click",function () {
	inputSelected = true;
	document.getElementById("uni_dropdown").style.display = "block";	
});

document.getElementById("uni_outputSelect").addEventListener("click",function () {
	inputSelected = false;
	document.getElementById("uni_dropdown").querySelector('h1').innerHTML = "Select Output:";	
	document.getElementById("uni_dropdown").style.display = "block";	
});

document.getElementById("uni_close").addEventListener("click",function () {
	document.getElementById("uni_dropdown").style.display = "none";	
});

document.getElementById("uni_swapButton").addEventListener("click",function () {
	swap();
});

document.getElementById("uni_approveButton").addEventListener("click",function () {
	approveLpSpending();
});

document.getElementById("uni_connectButton").addEventListener("click",function () {
	onConnect();	
});

document.getElementById("settings").addEventListener("click",function () {
	  var x = document.getElementById("slippageSettings");
	  if (x.style.display === "none") {
	    x.style.display = "block";
	  } else {
	    x.style.display = "none";
	  }	
});

setTimeout(updateUi, 1000);
setInterval(updateUi, 5000);
setInterval(updateButtons, 1000);

