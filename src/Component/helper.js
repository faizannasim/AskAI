export function check(str) {
    return /^(\*)(\*)(.*)\*$/.test(str);// it is used to check double star is present or not
}


export function ReplaceHead(str) {
   return str.replace(/^(\*)(\*)|(\*)$/g,"")
}


// it is used to replace thestar()