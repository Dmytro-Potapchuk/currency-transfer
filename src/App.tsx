import { CurrencyConverter } from "./components/CurrencyConverter";
import { TransferForm } from "./components/TransferForm";
import { TransactionList } from "./components/TransactionList";

import './App.css';

function App() {
    return (
        <div className="container">
            <h1 className="title">💸 Currency Transfer App</h1>
            <div className="sections">
                <CurrencyConverter />
                <TransferForm />
            </div>
            <TransactionList />
        </div>
    );
}

export default App;
