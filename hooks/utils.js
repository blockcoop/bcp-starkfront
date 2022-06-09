export function getShortAddress(address) {
    return String(address).substring(0, 6) + "..." + String(address).substring(60)
}
