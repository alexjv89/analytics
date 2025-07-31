# Transactions app

- purpose of this app
  - improve your money awareness. 
  - are you aware of what is happening with your money. 
  - did we nail that value proposition? 

## Development

### Quick Start
```bash
npm install
npm run dev              # Start development server
npm run build            # Build for production
npm run test             # Run tests
```

### Storybook
Component documentation and testing:
```bash
npm run storybook:dev    # Start Storybook
npm run storybook:test   # Run interaction tests
```

See [Storybook documentation](./docs/storybook/README.md) for details.

## parser 

- exported functions 
  - parseFile
- internal functions
  - extractTransactions
  - extractMetadata
  - isValid


### Transaction fields captured
- line - line number 
- date - date of transactions
- time - if time is available
- particulars
- inflow
- outflow
- balance - 
- remote_id - id that is shared by the bank


### 
design considerations 
