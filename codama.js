import { createCodamaConfig } from 'gill'

export default createCodamaConfig({
    clientJs: 'clients/js/src/generated',
    clientRust: 'clients/rs/src/generated',
    idl: './idl.json',
})
