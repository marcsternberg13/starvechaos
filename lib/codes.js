// Salted SHA-256 hashes of the page passwords. The passwords themselves are
// never stored in this repo. Regenerate with the password cheat sheet.
// Passwords are not case-sensitive: each hash is of the lowercased password.
// Format: key -> [salt, sha256(salt + ':' + password.toLowerCase())]. "all" = master password.
// A key can also hold a list of [salt, hash] pairs when the page takes more than one password.
export const HASHES = {
 "book-01": [
  "1157ff7e245b3e2a",
  "aec76b278edce109bce9e430f0c6d65ec7c44bc33d486e348c3d718348b6c404"
 ],
 "book-02": [
  "7dee3ae084001a37",
  "7a61c47f417e9ef408a8aa5001ac4f92254ff2236f38d7f64ff58663029e00af"
 ],
 "book-03": [
  "ce70b83c8a25b2be",
  "e46abfc1a39a1e540ec7d788ee4f84fbdcc06e1ee7e5f9d51ba9011871f2ffc0"
 ],
 "book-04": [
  "a860cb9fabf694ba",
  "72a3da704d4de0455f5a82220c9bcc8228bc3c331a0924adc2110e8c80fc0a48"
 ],
 "book-05": [
  "5f1418d9f013406f",
  "f99d9ac1ecabdeb182cedb1e04f874d56a549c75379d3649dd40f9508004ec96"
 ],
 "book-06": [
  "93ed8633b2313cd0",
  "a59dbea06d57a6fe4e4982732404004c7e7d0f8b727368ef7348a768042f759c"
 ],
 "book-07": [
  "971302762ba0ada9",
  "2530f7fa425cc413527332ccfb35919781601627b259e5907066a17acff89d17"
 ],
 "book-08": [
  "0ff614269a31904c",
  "0608dc6f9f66e051851dd98f9ed1ffac2aa190ffb014277743515c6bd214f181"
 ],
 "book-09": [
  "e5f16dc858f1d764",
  "23f26e766a2610b34382ac46b413152b8bc29b6179829c6f7fd6f3c740b0bc84"
 ],
 "book-10": [
  "ab8e0b320c8dabb7",
  "a74918a0032914a4554431348c2e2b934b6de101ae22af48c0b04c51981643e5"
 ],
 "book-11": [
  "b48aa50135914f3a",
  "8ec8846c28f00d8224cb9bc7bcac4fce9243baa36bf3af6f3512867852462e26"
 ],
 "book-12": [
  "8b31d16cd3c10a91",
  "29e31c8d78953511805a12b60b0f61b73e94746f48030b8310ae838e78d9aa0b"
 ],
 "book-part-1": [
  "259f0a4462878916",
  "95882e7460e3fa889ddc90a9371ba2720f11c3f94bb209cbc86d32fd05d67ece"
 ],
 "book-part-3": [
  "c04c4dcec46b3ee9",
  "62233898aae50a9751f7b2d408beb3cbb16d13ddde51f327bebaaba9b6d9cb47"
 ],
 "book-part-4": [
  "39f13f26b34c56fc",
  "ab786a1b53418c7a3892a654d6d53927a275ccc2d5c9e535af3e0cfd43b42108"
 ],
 "class-session-01": [
  [
   "0dfacc4b344ca4fb",
   "592473db36b34019b3a40e75212d0cadff98289dac02a882219dc49bcb9e6f7b"
  ],
  [
   "b1dbf0d80e2f32bc",
   "fee61d885cf277d9772ad6ee88a9996e89d89f6e924eda1d93ff8d15a958787c"
  ]
 ],
 "class-session-02": [
  "83814ba08fa4096f",
  "9bbde1d50468944b50f5da69a385626ced35f02d85842017342fbed91a1a3159"
 ],
 "class-session-03": [
  "e272d4606479ff2b",
  "4ceb8ef535306c0fc112fab6323941a2d6336ec50df1fbe5c882923266ad3968"
 ],
 "class-session-04": [
  "4ce761ac1ff66598",
  "96254567d7f94af8a4bb51b30f57739ec517d4e8004c8da50a4c3c87c7eae3c3"
 ],
 "class-session-05": [
  "4595171285a4ba72",
  "75e63b84351320ffbee1a14043ecae0a4b663494f12b53a4d33666ca2a9a73a7"
 ],
 "class-session-06": [
  "a97e19a9c84ca4ea",
  "cad3060c135dbfa4f50fe034aead36a91743fbf31fbc6d204293aef419e17b80"
 ],
 "class-session-07": [
  "8faf8d0a3a29f019",
  "389ff8ae7e5c0ad07a55ab7c37b56f453d51f5a6cca03b4a40391b186376fc40"
 ],
 "class-session-08": [
  "2ee32eb82b1946d6",
  "ba988da46808db34403d69474a9d18f8b603eb0fa1409c757c68021918283111"
 ],
 "class-session-09": [
  "4b613271b868943d",
  "e493dbfd87bfc861957177ff96d9ffbff0c108ee4383c906829ea68af681b6cc"
 ],
 "class-session-10": [
  "1a462a4833edc408",
  "22df355c6d40bbc8cf9131dedbd32d95ed3b65d4c1a7e9ff6bde1a635132f275"
 ],
 "class-session-11": [
  "6ff0a2f70c9ac71f",
  "8f03a648285c50bed7b633476466889fc9d599313750cd1cb2bc51c62defa740"
 ],
 "class-session-12": [
  "a47cf348d5c6a92a",
  "dbf2309807b99ce6866180be57ad57f4cb5a0b91988eaeb8efa10a68ae0c521d"
 ],
 "class-session-13": [
  "c142922fc56f1f95",
  "6b7a76f50cc48fbf96b07d37d3d5edc7d8e9901a08b5d23c30be112556ebab85"
 ],
 "class-session-14": [
  "906892a9e14bacf5",
  "0239a1607a52305fd0b7ddc2a62e2acff2310470ca326466e2eb77bdb1f10f22"
 ],
 "class-session-15": [
  "4cf62cae68f870b3",
  "6d994ab5f319fab68327a7b7c854f13e06dd347ed92b5c00a3833e4fa5ffe2a2"
 ],
 "class-session-16": [
  "a83ecaaf339dd20f",
  "16a85f51d9a1415036879a083c662986fe9b4bda845ee02fd9613b9e5a81841f"
 ],
 "class-session-17": [
  "e77e4d6fd8b6c00f",
  "cddd2a4dc1728670d2426a49d938cb1c6b8c57ea9fe01e137b7fa3a0461b6785"
 ],
 "class-session-18": [
  "ec7c312404a38a2e",
  "3680b39f974a67b42732cc4d99fafc7b05a8b994a3ea8beaf3a9c3926b54212e"
 ],
 "class-session-19": [
  "a01e604fbf451502",
  "cd4111c8f081436206333c96f37546477ff5c84096ff6a1987cde137ac122526"
 ],
 "class-session-20": [
  "a160770be9fa7bc3",
  "fe92bfcfdf548a0c639b25e369e91c2269874ee0f99ae0b4179459ba600ff370"
 ],
 "class-session-21": [
  "622fe908e6a8c192",
  "7d765daf25ff929627d5ed85d791c4778dbf7f2fd0c169ea72e5e2e5f319810a"
 ],
 "class-session-22": [
  "a5433a22650fa2a6",
  "13fab94ead226a34857fdfb601629afec2a40dc2d4fcb2730bee2f68144ee214"
 ],
 "class-session-23": [
  "c068ecb3ce68cedc",
  "d12db50abfd8eacc9acac84da01e562624136eab30239f2dfa087f30dd1377ec"
 ],
 "class-session-24": [
  "bfa8a4925db795b4",
  "a84774d6083b66a585db60bcadded0e5b0db011ec30e2de3e5674f6b941c7c7f"
 ],
 "class-session-25": [
  "36b799dfe49128df",
  "d63f614e45e4322bd6a3bfe99b863bf599edf94452930a461a4085411fd84f4c"
 ],
 "class-session-26": [
  "befa66f112ada9d6",
  "a062fa9f08bb98c5c428a4794d8906e17196b5a83d8e347b44a1e27d1e811dcc"
 ],
 "class-session-27": [
  "c1afb9e37e530ad4",
  "0da15870f502619407d9aedada6071cf14e80e0895415deb9f8a6b6676ab8815"
 ],
 "class-session-28": [
  "a082be880c7ee4a0",
  "f2f9dee1fddef7d7e58a10482c9d36b5b1d4f214e0cd995114f77adb293828c5"
 ],
 "class-session-29": [
  "6c9f2ccc902f5f92",
  "993c28b7a6f2d1972c3076194e4fd1d24f2053147c4efe5e1a131a77de2e50fe"
 ],
 "class-session-30": [
  "8936844d06d5c4e2",
  "2a819a348a8bf2e95d7d29d31829ccba1d1f21c9a62c5f32b79d5501595f52ce"
 ],
 "class-session-31": [
  "8ebc58411cc3572f",
  "f61a3a96856b1d287390322afb752cfe236382bb8c6df96138e8c070d28fc2a5"
 ],
 "class-session-32": [
  "4d65bd293d2f7ca9",
  "d260ab9981dd82454884874c2155f1b5f18efb74c949bd47dc3fc11459adc8f3"
 ],
 "all": [
  "c6f55b6031394162",
  "e01d69ffaf81cf8c8be3bc41993879bc67bf8f172cc17fbf136b3bfa68a4ff51"
 ]
};
