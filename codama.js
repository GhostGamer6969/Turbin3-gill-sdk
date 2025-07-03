import { createCodamaConfig } from "gill";

export default createCodamaConfig({
    idl: "./idl.json",
    clientJs: "clients/js/src/generated",
});
