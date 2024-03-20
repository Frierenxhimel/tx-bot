const { ethers } = require('ethers')
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia/7cbd90d82e6952f75556e4cd870c824dd96f9cc9b43f1de33d6276da60985f70") // Change This
const receiverWallet = '0x1d08799acc1DD5caE52a35e1d84395822A4fcd74' // Change This
const privateKeys = ["0xa1bd1a3eca3bd370e1059389d56a6f7a1bdb551dd2882e0619468a6ce38b7482"] // Change This

// Clear Console
console.clear() 

//ASCII Banner
var figlet = require('figlet');

figlet.text('TX - Bot', {
    font: 'Standard',
    horizontalLayout: 'default',
    width: 40,
    whitespaceBreak: false
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    });

// Welcome Message
    
    provider.once('block', (transaction) => {
    console.log("Wallet Balance Auto Sender / Address Cleaner\n");
    console.log("- https://github.com/hanzvibes/tx-bot\n");
    console.log("Current Network State :\n");
    console.log("Block Number : ",transaction);
    });
    provider.getGasPrice().then((gasPrice) => {
    gasPriceString = gasPrice.toString();
    console.log("Current Gas Price : ",gasPriceString);
    console.log("\n");
    });

const txBot = async =>{
    provider.on('block', async () => {    
    const { chainId, name } = await provider.getNetwork()
        console.log('<',name,'>', 'Waiting for transaction...');       
        for (let i = 0; i < privateKeys.length; i++){
            const _signer = new ethers.Wallet(privateKeys[i]);
            const signer = _signer.connect(provider);
            const balance = await provider.getBalance(signer.address);
            const txBuffer = ethers.utils.parseEther("0.0005");
            if (balance.sub(txBuffer) > 0){
                console.log('<',name,'>' , "New balance detected...");
                const amount = balance.sub(txBuffer);
                console.log('<',name,'>' , "Sending....");
                console.log('<',name,'>' , "Waiting transaction hash...");                
                try {
                    const transaction = await signer.sendTransaction({
                        to: receiverWallet,
                        value: amount,
                        gasLimit: ethers.utils.hexlify(100000) // 100 Gwei
                    }); 
                   console.log(transaction)                   
                   }
                finally {
                console.log('<',name,'>' , "Success ✓");
                console.log('<',name,'>' , `Total amount : ~${ethers.utils.formatEther(balance)}`);
                }
            }
        }
    })
}
txBot();
