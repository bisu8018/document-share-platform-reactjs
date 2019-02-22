import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/custom/HeaderButton";

const style = {};

class ContentViewBlockchainButton extends React.Component {

    state = {
        isExistDataKey: null,
        stackId: null,
        reload: false
    };

    componentDidMount() {
        const {drizzleApis} = this.props;
        //const drizzleState = drizzle.store.getState();
        // subscribe to changes in the store
        this.unsubscribe = drizzleApis.subscribe((drizzle, drizzleState) => {
            // every time the store updates, grab the state from drizzle
            //const drizzleState = drizzle.store.getState();
            // check to see if it's ready, if so, update local component state

            //console.log("ContentViewRegistBlockchainButton drizzle initialized", drizzleState);

            this.printTxStatus(drizzle, drizzleState);


        });
    }

    componentWillUnmount() {
        const {drizzleApis} = this.props;
        drizzleApis.unsubscribe(this.unsubscribe);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {drizzleApis} = this.props;
        //console.log("shoudComponentUpdate drizzleApis.isAuthenticated()", drizzleApis.isAuthenticated());
        if (drizzleApis.isInitialized() && drizzleApis.isAuthenticated()) {
            this.checkDocumentInBlockChain();
        }
        return true;
    }

    checkDocumentInBlockChain = () => {
        const {document, drizzleApis} = this.props;
        if (!drizzleApis.isInitialized() || !drizzleApis.isAuthenticated()) return;

        if (this.state.isExistDataKey) return;

        if (!document) return;

        try {
            console.log(document);
            const dataKey = drizzleApis.requestIsExistDocument(document.documentId);
            this.setState({isExistDataKey: dataKey});
            console.log("checkDocumentInBlockChain dataKey", dataKey);
        } catch (e) {
            console.error("checkDocumentInBlockChain error", e);
        }
    };

    isExistDocument = () => {
        const {drizzleApis} = this.props;

        if (this.state.isExistDataKey) {
            return drizzleApis.isExistDocument(this.state.isExistDataKey);
        }
    };

    _handleRegistDocumentInBlockChain = () => {

        const {document, drizzleApis} = this.props;

        if (!document) return;

        const stackId = drizzleApis.registDocumentToSmartContract(document.documentId);
        this.setState({stackId: stackId});

    };


    printTxStatus = (drizzle, drizzleState) => {
        // get the transaction states from the drizzle state
        const {transactions, transactionStack} = drizzleState;
        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId];
        // if transaction hash does not exist, don't display anything
        if (!txHash) return;

        const txState = transactions[txHash].status;
        const txReceipt = transactions[txHash].receipt;
        //const confirmations = transactions[txHash].confirmations;


        console.log("printTxStatus", txState, txReceipt, transactions[txHash]);
    };

    render() {
        const {document, drizzleApis} = this.props;

        if (!drizzleApis.isAuthenticated()) return null;

        const disabled = document.accountId === drizzleApis.getLoggedInAccount();

        if (!this.isExistDocument() && !disabled) {
            return (
                <div>
                    <Button color="rose" size="sm" onClick={this._handleRegistDocumentInBlockChain} disabled={disabled}>Register
                        to BlockChain
                    </Button>
                </div>
            );
        }
        return null;
    }
}

export default withStyles(style)(ContentViewBlockchainButton);
