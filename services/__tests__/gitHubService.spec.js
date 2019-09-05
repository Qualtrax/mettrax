import gitHubService from "../gitHubService";
const tags = [
    {
        id: 'MDM6VGFnMTc0OTIxODA6Njc4MjA3NjAyNGYyNDg4M2Y2ZWFlOGJmZTFjZGI4ZWM4ZDg2Y2UxOA==',
        name: '2019.3.0.1',
        commitDate: '2019-08-29T20:52:42Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6NWUyMjFlNTAxNjBjNzJhNGMzZjBjNDgwMzlkZTRiNTkyNzQwNzJlZA==',
        name: '2019.3.0.0',
        commitDate: '2019-08-26T19:54:06Z',
        isMajor: true
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6N2NhZTJlMGMxNTdiNGJjZjNkZjA3NjY1Yzg4MDVjZTE0YjA1MjgwYw==',
        name: '2019.2.0.1',
        commitDate: '2019-07-23T23:47:26Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6NGY5YTgyMTI4ZmU0NDMyZDk3YjhkY2UzNDYwZWE2MWY1MTMzNWNlNg==',
        name: '2019.1.0.2',
        commitDate: '2019-07-23T21:18:06Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6YTI5MWZjNTYwYTA3NDExMWI2MDFmZTM3ZGI0NzkwNWVmOTg1ZjFmNQ==',
        name: '2019.2.0.0',
        commitDate: '2019-07-09T17:38:31Z',
        isMajor: true
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6MjUwMzA5ZmY5YWM2ODdhMDQ2MjRkNDQzZTE1OGNiMWY0ZWVjNTljMw==',
        name: '2019.1.0.1',
        commitDate: '2019-04-05T14:35:08Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6MTg0ZWU4MTNhMWU0MDIyOTdhNWIyNWM4ZDk4ODNkZTYyYjBkNmNjNw==',
        name: '2018.3.0.5',
        commitDate: '2019-04-04T20:32:41Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6NGQwMTgxNzRkYjgwZWJiMjdlODgxMjQwYTU5N2E0M2EzZTQ3YmRjNg==',
        name: '2019.1.0.0',
        commitDate: '2019-03-20T20:39:12Z',
        isMajor: true
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6N2M5MzNiNDQ4NDI2NjNhNTViY2U2NDFhYzU0ZDE2NzkwNjE4MTZjMQ==',
        name: '2018.3.0.4',
        commitDate: '2019-03-13T19:42:59Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6OGFlMjJhNWI2ZDEwZDkzOTc2OTg3ZDE4ZjI4NDU0MmI2NTMzODVkNg==',
        name: '2018.2.0.4',
        commitDate: '2019-03-13T18:59:07Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6MWY5YTM4Yzg4MDk4ODA5MTU5NmI4MjdiNzVmMzdkYTAyOGNhZWQ2OA==',
        name: '2018.1.0.6',
        commitDate: '2019-03-13T18:28:09Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6OTg2MmZmMGM0NjFkM2VkMTY5Zjk3ODNmMjY1MTI4YjNiYjczNGE2OA==',
        name: '2017.2.0.14',
        commitDate: '2019-03-13T18:25:30Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6OTAyM2E1M2QyOTk2MTM3YjE4YzM3MWU1NDQ4MzA4ZDk3MTNiNWQ2Nw==',
        name: '2018.3.0.3',
        commitDate: '2019-02-19T15:15:30Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6MWY3NWU1MzgwOWQ2NTU1NGNiYjFjM2E5OTg0MmZkMTU5M2NkOGE3ZQ==',
        name: '2018.2.0.3',
        commitDate: '2019-02-19T00:53:15Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6ODQ5MmYxYjgxOWNlNzI2NzU1MTcxZDc4MDhiMzFhOGQzODAyNTAxNQ==',
        name: '2018.1.0.5',
        commitDate: '2019-02-18T21:53:04Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6YzQ2OTg3NDM4ZjY1OTg4YTI1MDUyNTFiYWVkMDUyMzIyZTc5OWI5ZQ==',
        name: '2017.2.0.13',
        commitDate: '2019-02-18T19:13:49Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6YzY4OTU2Yjg2NDdmNGM2Y2U2M2ZiN2MzOWIzNjJjYTVlZjRmM2IyZA==',
        name: '2017.1.0.8',
        commitDate: '2019-02-18T17:36:20Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6Y2M4ZjFjMDgzODA5ZTM1NGU2MzhmMTFiN2M2YjI0YjdiNmM4NTJjNA==',
        name: '2016.5.0.4',
        commitDate: '2019-02-18T14:50:01Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6ZGI5NzhhYjNlNjA5Yzk3MDRjZDU5YWExNjg1ZWMzOWRhOGU1YTRjMQ==',
        name: '2018.3.0.2',
        commitDate: '2019-02-08T18:47:52Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6ZDg1YTdkMGU3NjAzMGExYWUzOTZmMWY0ZmI1NGRjNWRkYTdlMWY5Yw==',
        name: '2018.3.0.1',
        commitDate: '2019-01-21T15:14:23Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6OWRkMmZhZDg1MTc3ODRjMDgxOWEwOTM4OWZjNDU5MjA4YjVkZDMyOQ==',
        name: '2018.2.0.2',
        commitDate: '2019-01-18T20:52:30Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6ZDhhZTNmZDUyODE2ZTc1OWZkZWRjMzVlMzJjZDE1OTNmZTIwNzJjZQ==',
        name: '2018.1.0.4',
        commitDate: '2019-01-18T19:39:38Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6ZGNiYjU5NjMwODZjOWZjM2M3ZjA4YmZkNmEyMzY4Yjg0NTI4NGNkMA==',
        name: '2017.2.0.12',
        commitDate: '2019-01-18T18:31:10Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6ZGVmODFkNmZiOGZjZTEyYzM4MjcyMTY0YTQ3MmViNGE0NzQ4YzlmMw==',
        name: '2018.3.0.0',
        commitDate: '2018-12-20T20:42:30Z',
        isMajor: true
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6ODJhYmQ3M2QyMzI5NGQ3YzNhZDNhNWMyMDQ4Y2M3ZDY1NjNmYmE5Yw==',
        name: '2018.2.0.1',
        commitDate: '2018-11-12T22:07:04Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6N2ZhMzYyNzY3ZDVlOTEzMDVjYTBiZjIxOTE3OTc3NWNiZThhZTFkMg==',
        name: '2018.2.0.0',
        commitDate: '2018-10-26T14:34:36Z',
        isMajor: true
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6YmE5MDJkNDdhMDUzMDI5NTUxNGIyOWM0MjA0ZWViMWRjMjY2NGRmOA==',
        name: '2018.1.0.3',
        commitDate: '2018-10-18T20:25:07Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6Y2IyYTZjMTc0MjJmZmQyY2FiYjcyNDgxODg0MmQ4NGNiZWZmNTQ4Ng==',
        name: '2018.1.0.2',
        commitDate: '2018-09-12T20:32:43Z',
        isMajor: false
    },
    {
        id: 'MDM6VGFnMTc0OTIxODA6NDA5NTliYTg5YmE3ZTMxZDk0OTcyM2ExMjYxMmRjODhmYzg3YWM2ZA==',
        name: '2017.2.0.11',
        commitDate: '2018-09-12T18:37:01Z',
        isMajor: false
    }
];
const commits = [
    {
        committedDate: '2019-08-29T20:47:38Z',
        messageHeadline: '[gh3462] Login with SAML Does Not ' +
            'Work with Cookie SameSite = Strict',
        repository: 'qualtrax',
        issueNumber: '3462'
    },
    {
        committedDate: '2019-08-29T20:47:38Z',
        messageHeadline: '[gh3460] Fix Merge and QA Builds',
        repository: 'qualtrax',
        issueNumber: '3460'
    },
    {
        committedDate: '2019-08-26T19:54:06Z',
        messageHeadline: '[gh3448] SameSite Cookies without ' +
            'using Rewrites using .Net Upgrade',
        repository: 'qualtrax',
        issueNumber: '3448'
    },
    {
        committedDate: '2019-08-14T18:18:48Z',
        messageHeadline: '[gh3351] Improve automated test ' +
            'coverage around document and folder ' +
            's…',
        repository: 'qualtrax',
        issueNumber: '3351'
    },
    {
        committedDate: '2019-08-12T18:50:02Z',
        messageHeadline: '[gh3317] Security Scans: Security ' +
            'Headers that Prevent Cross-Site ' +
            'Scr…',
        repository: 'qualtrax',
        issueNumber: '3317'
    },
    {
        committedDate: '2019-08-07T19:51:51Z',
        messageHeadline: '[gh3313] Secure Cookies',
        repository: 'qualtrax',
        issueNumber: '3313'
    },
    {
        committedDate: '2019-08-06T19:08:38Z',
        messageHeadline: '[ghweb238] Implement a clear icon button',
        repository: 'qualtrax-web',
        issueNumber: '238'
    },
    {
        committedDate: '2019-08-02T14:03:18Z',
        messageHeadline: '[gh3156] Workflows - New Row ' +
            'Added When Trying to ' +
            'Transition',
        repository: 'qualtrax',
        issueNumber: '3156'
    },
    {
        committedDate: '2019-08-02T14:03:18Z',
        messageHeadline: '[gh3321] Security Scans: Validate Redirects',
        repository: 'qualtrax',
        issueNumber: '3321'
    },
    {
        committedDate: '2019-08-02T14:02:26Z',
        messageHeadline: '[gh3326] Security Scans: ' +
            'Encode Data Written to ' +
            'Responses',
        repository: 'qualtrax',
        issueNumber: '3326'
    },
    {
        committedDate: '2019-07-23T14:40:48Z',
        messageHeadline: '[gh917] Browser Back Grants Access',
        repository: 'qualtrax',
        issueNumber: '917'
    },
    {
        committedDate: '2019-07-19T15:34:40Z',
        messageHeadline: '[gh2532] Subform - Can\'t save ' +
            'values on already existing instance ' +
            'whe…',
        repository: 'qualtrax',
        issueNumber: '2532'
    },
    {
        committedDate: '2019-07-09T17:38:31Z',
        messageHeadline: '[gh3327] UGI - Login Name Already ' +
            'Exists error appears when blank ' +
            'value',
        repository: 'qualtrax',
        issueNumber: '3327'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3300] UGI - No error thrown when ' +
            'attempting to remove member not i…',
        repository: 'qualtrax',
        issueNumber: '3300'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3305] UGI - Bad error when ' +
            'adding members to a group AND ' +
            'removing …',
        repository: 'qualtrax',
        issueNumber: '3305'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3294] UGI - Invalid Date Error ' +
            'Thrown for Empty Date Custom Fields',
        repository: 'qualtrax',
        issueNumber: '3294'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3296] UGI - No longer get errors ' +
            'for invalid tests/training IDs ov…',
        repository: 'qualtrax',
        issueNumber: '3296'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3292] UGI - Row Numbers are not ' +
            'included in Import Errors for Groups',
        repository: 'qualtrax',
        issueNumber: '3292'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3293] UGI - Negative Integers in ' +
            'User ID and Group ID columns thro…',
        repository: 'qualtrax',
        issueNumber: '3293'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3295] UGI - "Successfully" ' +
            'is spelled wrong in UGI Log',
        repository: 'qualtrax',
        issueNumber: '3295'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3290] UGI - LDAP User can be ' +
            'created with Empty Login Name',
        repository: 'qualtrax',
        issueNumber: '3290'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3288] UGI: User Id in the ' +
            'Audit Trail logs is being set to ' +
            '0',
        repository: 'qualtrax',
        issueNumber: '3288'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3285] UGI - No line breaks in UGI Log File',
        repository: 'qualtrax',
        issueNumber: '3285'
    },
    {
        committedDate: '2019-07-03T15:34:43Z',
        messageHeadline: '[gh3269] UGI: Add audit trail for ' +
            'changing authentication options',
        repository: 'qualtrax',
        issueNumber: '3269'
    },
    {
        committedDate: '2019-07-03T15:34:42Z',
        messageHeadline: '[gh3218] UGI: Do not require an ' +
            'email address for auto enrolled',
        repository: 'qualtrax',
        issueNumber: '3218'
    },
    {
        committedDate: '2019-07-03T15:34:42Z',
        messageHeadline: '[gh3227] UGI: Update User ' +
            'Validation to account for License ' +
            'Type on',
        repository: 'qualtrax',
        issueNumber: '3227'
    },
    {
        committedDate: '2019-07-03T15:34:42Z',
        messageHeadline: '[gh3244] UGI: Adjust User Import to ' +
            'save all authentication options w…',
        repository: 'qualtrax',
        issueNumber: '3244'
    },
    {
        committedDate: '2019-07-03T15:34:42Z',
        messageHeadline: '[gh3232] UGI: Adjust User Import ' +
            'to save all authentication options',
        repository: 'qualtrax',
        issueNumber: '3232'
    },
    {
        committedDate: '2019-07-03T15:34:42Z',
        messageHeadline: '[gh3246] UGI: Visually hide buttons ' +
            'for tools that have not been migr…',
        repository: 'qualtrax',
        issueNumber: '3246'
    },
    {
        committedDate: '2019-07-03T15:34:42Z',
        messageHeadline: '[gh3162] UGI: Validate Authentication Input (on load)',
        repository: 'qualtrax',
        issueNumber: '3162'
    },
    {
        committedDate: '2019-07-03T15:34:42Z',
        messageHeadline: '[gh3196] UGI: Update User Validation ' +
            'to account for License Type on Load',
        repository: 'qualtrax',
        issueNumber: '3196'
    },
    {
        committedDate: '2019-07-03T15:34:41Z',
        messageHeadline: '[gh3243] UGI: Create validation ' +
            'policy and make Authentication ' +
            'required',
        repository: 'qualtrax',
        issueNumber: '3243'
    },
    {
        committedDate: '2019-07-03T15:34:41Z',
        messageHeadline: '[gh3233] UGI: Remove ability to ' +
            'add groups as Members or Managers ' +
            'of',
        repository: 'qualtrax',
        issueNumber: '3233'
    },
    {
        committedDate: '2019-07-03T15:34:41Z',
        messageHeadline: '[gh3163] UGI: Make Enable ' +
            'Option required for Group ' +
            'Import',
        repository: 'qualtrax',
        issueNumber: '3163'
    },
    {
        committedDate: '2019-07-03T15:34:41Z',
        messageHeadline: '[gh3222] UGI: Extract GroupImport ' +
            'GetErrors into GroupRowValidator',
        repository: 'qualtrax',
        issueNumber: '3222'
    },
    {
        committedDate: '2019-07-03T15:34:41Z',
        messageHeadline: '[gh3221] UGI: Change user import ' +
            'column "LDAP" to "Authentication"',
        repository: 'qualtrax',
        issueNumber: '3221'
    },
    {
        committedDate: '2019-07-03T15:34:41Z',
        messageHeadline: '[GH3195] UGI: Update User ' +
            'Validation to include Language ' +
            'Check',
        repository: 'qualtrax',
        issueNumber: '3195'
    },
    {
        committedDate: '2019-07-03T15:34:41Z',
        messageHeadline: '[gh3209] UGI: Enforce Valid Group ID',
        repository: 'qualtrax',
        issueNumber: '3209'
    },
    {
        committedDate: '2019-07-03T15:34:40Z',
        messageHeadline: '[gh3064] UGI: Fix Parent-Child ' +
            'Relationship with Group Import',
        repository: 'qualtrax',
        issueNumber: '3064'
    },
    {
        committedDate: '2019-07-03T15:34:40Z',
        messageHeadline: '[gh3210] UGI: Validate User Id is a Valid Value',
        repository: 'qualtrax',
        issueNumber: '3210'
    },
    {
        committedDate: '2019-07-03T15:34:40Z',
        messageHeadline: '[gh3191] UGI: User Creation/Update Validation',
        repository: 'qualtrax',
        issueNumber: '3191'
    },
    {
        committedDate: '2019-07-03T15:34:40Z',
        messageHeadline: '[gh3060] UGI: Import and Update Groups by ID',
        repository: 'qualtrax',
        issueNumber: '3060'
    },
    {
        committedDate: '2019-07-03T15:34:40Z',
        messageHeadline: '[gh3197] UGI: Update "Id" in User ' +
            'sheet to be "User ID" and make ' +
            'requ…',
        repository: 'qualtrax',
        issueNumber: '3197'
    },
    {
        committedDate: '2019-07-03T15:34:40Z',
        messageHeadline: '[gh3059] UGI: Import and Update Users by ID',
        repository: 'qualtrax',
        issueNumber: '3059'
    },
    {
        committedDate: '2019-07-03T15:34:40Z',
        messageHeadline: '[gh3158] UGI: Refactor ModelBinder with Tests',
        repository: 'qualtrax',
        issueNumber: '3158'
    },
    {
        committedDate: '2019-07-03T15:34:40Z',
        messageHeadline: '[gh3126] UGI: Improve Group Error Handling',
        repository: 'qualtrax',
        issueNumber: '3126'
    },
    {
        committedDate: '2019-07-03T15:34:39Z',
        messageHeadline: '[gh3058] UGI: Improve Import User Error Handling',
        repository: 'qualtrax',
        issueNumber: '3058'
    },
    {
        committedDate: '2019-07-03T15:34:39Z',
        messageHeadline: '[gh3071] Migrate ServerTools to Qualtrax Repo',
        repository: 'qualtrax',
        issueNumber: '3071'
    },
    {
        committedDate: '2019-06-12T15:03:04Z',
        messageHeadline: '[ghweb417] Actions menu can overlap ' +
            'or be hidden by surrounding compo…',
        repository: 'qualtrax-web',
        issueNumber: '417'
    },
    {
        committedDate: '2019-05-13T18:13:47Z',
        messageHeadline: '[ghweb471] Correct Unintended ' +
            'Change to Open Unpublished New ' +
            'Revision…',
        repository: 'qualtrax-web',
        issueNumber: '471'
    },
    {
        committedDate: '2019-05-13T16:03:13Z',
        messageHeadline: '[ghweb472] Correct Unintended ' +
            'Change to Open Unpublished New ' +
            'Revision…',
        repository: 'qualtrax-web',
        issueNumber: '472'
    },
    {
        committedDate: '2019-04-18T13:59:57Z',
        messageHeadline: '[gh3203] Set C# Language Version in all projects',
        repository: 'qualtrax',
        issueNumber: '3203'
    },
    {
        committedDate: '2019-04-15T21:47:29Z',
        messageHeadline: '[gh3171] Merge 2019 R1 terms',
        repository: 'qualtrax',
        issueNumber: '3171'
    },
    {
        committedDate: '2019-04-10T04:16:56Z',
        messageHeadline: '[ghweb432] Allow visitors nav',
        repository: 'qualtrax-web',
        issueNumber: '432'
    },
    {
        committedDate: '2019-04-10T02:35:27Z',
        messageHeadline: '[ghweb416] Context Menu missing ' +
            'Actions on Manual and Automatic ' +
            'File …',
        repository: 'qualtrax-web',
        issueNumber: '416'
    },
    {
        committedDate: '2019-04-04T18:34:15Z',
        messageHeadline: '[gh3173] UL Workflow Quick Search',
        repository: 'qualtrax',
        issueNumber: '3173'
    },
    {
        committedDate: '2019-03-20T20:39:12Z',
        messageHeadline: '[ghweb419] Remove addition of body tag font changes',
        repository: 'qualtrax-web',
        issueNumber: '419'
    },
    {
        committedDate: '2019-03-13T17:30:04Z',
        messageHeadline: '[gh3148] Improve browse tree performance',
        repository: 'qualtrax',
        issueNumber: '3148'
    },
    {
        committedDate: '2019-03-12T13:36:51Z',
        messageHeadline: '[gh3150] Optimize FindByDocumentId query',
        repository: 'qualtrax',
        issueNumber: '3150'
    },
    {
        committedDate: '2019-03-07T16:54:23Z',
        messageHeadline: '[ghweb329-326] - Document viewer ' +
            'overlaps / context menu shrinks',
        repository: 'qualtrax-web',
        issueNumber: '329-326'
    },
    {
        committedDate: '2019-03-06T21:02:58Z',
        messageHeadline: '[ghweb413] Apostrophe in Login ' +
            'Welcome term not using standard ' +
            'character',
        repository: 'qualtrax-web',
        issueNumber: '413'
    },
    {
        committedDate: '2019-03-01T16:25:19Z',
        messageHeadline: '[gh3131] Cleanup and refactor ' +
            'LicenseTypeChecker and ' +
            'LicenseKeyDetail…',
        repository: 'qualtrax',
        issueNumber: '3131'
    },
    {
        committedDate: '2019-02-28T15:31:13Z',
        messageHeadline: '[ghweb384] Add ability to ' +
            'right-click context menu items to ' +
            'open in n…',
        repository: 'qualtrax-web',
        issueNumber: '384'
    },
    {
        committedDate: '2019-02-27T20:20:50Z',
        messageHeadline: '[ghweb399] Update title page to new font and verbiage',
        repository: 'qualtrax-web',
        issueNumber: '399'
    },
    {
        committedDate: '2019-02-26T21:55:02Z',
        messageHeadline: '[ghweb397] Change Username ' +
            'back to Login Name on Login ' +
            'Page',
        repository: 'qualtrax-web',
        issueNumber: '397'
    },
    {
        committedDate: '2019-02-25T15:34:49Z',
        messageHeadline: '[GH3075] Remove/Reorganize Project References',
        repository: 'qualtrax',
        issueNumber: '3075'
    },
    {
        committedDate: '2019-02-21T17:34:40Z',
        messageHeadline: '[gh3101] taking out Admin Dashboard from develop',
        repository: 'qualtrax',
        issueNumber: '3101'
    },
    {
        committedDate: '2019-02-20T17:12:08Z',
        messageHeadline: '[ghweb381] Username Text is ' +
            'Illegible when Field is ' +
            'Disabled',
        repository: 'qualtrax-web',
        issueNumber: '381'
    },
    {
        committedDate: '2019-02-19T21:36:55Z',
        messageHeadline: '[gh3101] Add View Admin Dashboards permission',
        repository: 'qualtrax',
        issueNumber: '3101'
    },
    {
        committedDate: '2019-02-15T19:36:12Z',
        messageHeadline: '[gh3104] ShowDocument.aspx ' +
            'disregards view security if Embed ' +
            'query',
        repository: 'qualtrax',
        issueNumber: '3104'
    },
    {
        committedDate: '2019-02-14T16:44:29Z',
        messageHeadline: '[gh3081] Inaccurate Inherited ' +
            'Secuirty in DB for some ' +
            'documents',
        repository: 'qualtrax',
        issueNumber: '3081'
    },
    {
        committedDate: '2019-02-12T20:45:49Z',
        messageHeadline: '[ghweb376] Match color for ' +
            'checkmarks in login page to ' +
            'Qualtrax icon',
        repository: 'qualtrax-web',
        issueNumber: '376'
    },
    {
        committedDate: '2019-02-08T18:44:29Z',
        messageHeadline: '[ghweb378] Call to external URL ' +
            'prevents Qualtrax access without ' +
            'addi…',
        repository: 'qualtrax-web',
        issueNumber: '378'
    },
    {
        committedDate: '2019-02-07T23:17:52Z',
        messageHeadline: '[ghweb352] Login/Username ' +
            'field in focus when not ' +
            'editable',
        repository: 'qualtrax-web',
        issueNumber: '352'
    },
    {
        committedDate: '2019-02-07T22:17:25Z',
        messageHeadline: '[ghweb349] Change Login field nomenclature',
        repository: 'qualtrax-web',
        issueNumber: '349'
    },
    {
        committedDate: '2019-02-04T20:37:50Z',
        messageHeadline: '[ghweb358] T/T License Setting ' +
            'persists upon Log In as different ' +
            'user',
        repository: 'qualtrax-web',
        issueNumber: '358'
    },
    {
        committedDate: '2019-02-01T18:58:19Z',
        messageHeadline: '[ghweb345] Unable to Login with SSO with hot key (Enter)',
        repository: 'qualtrax-web',
        issueNumber: '345'
    },
    {
        committedDate: '2019-02-01T16:12:14Z',
        messageHeadline: '[ghweb339] Add Login as a ' +
            'different user link back to ' +
            'Login Page',
        repository: 'qualtrax-web',
        issueNumber: '339'
    },
    {
        committedDate: '2019-01-31T21:26:21Z',
        messageHeadline: '[ghweb240] Integrate Login component',
        repository: 'qualtrax-web',
        issueNumber: '240'
    },
    {
        committedDate: '2019-01-30T18:30:27Z',
        messageHeadline: '[ghweb346] Add missing term for Recent Items',
        repository: 'qualtrax-web',
        issueNumber: '346'
    },
    {
        committedDate: '2019-01-28T20:08:05Z',
        messageHeadline: '[gh3067] Correct Missing en-us terms',
        repository: 'qualtrax',
        issueNumber: '3067'
    },
    {
        committedDate: '2019-01-24T19:36:56Z',
        messageHeadline: '[ghweb319] New wrapper terms not being handled correctly',
        repository: 'qualtrax-web',
        issueNumber: '319'
    },
    {
        committedDate: '2019-01-24T16:54:36Z',
        messageHeadline: '[ghweb302] User Preferences Icon is ' +
            'greyed out when Favorites menu is…',
        repository: 'qualtrax-web',
        issueNumber: '302'
    },
    {
        committedDate: '2019-01-24T15:31:47Z',
        messageHeadline: '[ghweb327] No Go Back button for ' +
            'Adv Doc Search when no results',
        repository: 'qualtrax-web',
        issueNumber: '327'
    },
    {
        committedDate: '2019-01-23T21:54:39Z',
        messageHeadline: '[ghweb324] Search Results page missing title',
        repository: 'qualtrax-web',
        issueNumber: '324'
    },
    {
        committedDate: '2019-01-23T19:48:43Z',
        messageHeadline: '[ghweb328] Added target for api link',
        repository: 'qualtrax-web',
        issueNumber: '328'
    },
    {
        committedDate: '2019-01-18T19:24:53Z',
        messageHeadline: '[ghweb336] Automatic File Transfer ' +
            '- Error thrown in web upon check-i…',
        repository: 'qualtrax-web',
        issueNumber: '336'
    },
    {
        committedDate: '2019-01-18T15:45:00Z',
        messageHeadline: '[gh2916] Subform does not enforce ' +
            'having a row created when required',
        repository: 'qualtrax',
        issueNumber: '2916'
    },
    {
        committedDate: '2019-01-08T21:48:33Z',
        messageHeadline: '[GH3038] Merge R3 terms and other missing terms',
        repository: 'qualtrax',
        issueNumber: '3038'
    },
    {
        committedDate: '2018-12-20T20:42:30Z',
        messageHeadline: '[ghweb318] Using a Virtual ' +
            'Directory Some Links are not ' +
            'Resolving Cor…',
        repository: 'qualtrax-web',
        issueNumber: '318'
    },
    {
        committedDate: '2018-12-20T15:10:51Z',
        messageHeadline: '[gh2981] Implementation of Security ' +
            'and Permissions of Route Workflow…',
        repository: 'qualtrax',
        issueNumber: '2981'
    },
    {
        committedDate: '2018-12-20T15:09:13Z',
        messageHeadline: '[gh2978] Implementation of ' +
            'Route Workflow in Workflow ' +
            'API',
        repository: 'qualtrax',
        issueNumber: '2978'
    },
    {
        committedDate: '2018-12-20T15:09:12Z',
        messageHeadline: '[gh2817] Workflow API - Add Attach ' +
            'External File Post Functionality',
        repository: 'qualtrax',
        issueNumber: '2817'
    },
    {
        committedDate: '2018-12-20T15:09:12Z',
        messageHeadline: '[gh2781] Workflow API - Refactor ' +
            'SaveExternalFileField to be ' +
            'reusable…',
        repository: 'qualtrax',
        issueNumber: '2781'
    },
    {
        committedDate: '2018-12-19T14:05:27Z',
        messageHeadline: '[ghweb313] Limit Advanced Search ' +
            'and Results drop-downs and add ' +
            'scrol…',
        repository: 'qualtrax-web',
        issueNumber: '313'
    },
    {
        committedDate: '2018-12-14T19:27:57Z',
        messageHeadline: '[ghweb304] Navigation subitems are missing hover color',
        repository: 'qualtrax-web',
        issueNumber: '304'
    },
    {
        committedDate: '2018-12-14T16:24:24Z',
        messageHeadline: '[gh3020] Integration script updated',
        repository: 'qualtrax',
        issueNumber: '3020'
    },
    {
        committedDate: '2018-12-14T15:36:37Z',
        messageHeadline: '[ghweb296] [gh3015] Hover tips on ' +
            'Personnel Permission page broken ' +
            'on…',
        repository: 'qualtrax-web',
        issueNumber: '296'
    },
    {
        committedDate: '2018-12-14T15:36:36Z',
        messageHeadline: '[ghweb301] [gh3019] Double Scrollbars appear',
        repository: 'qualtrax-web',
        issueNumber: '301'
    },
    {
        committedDate: '2018-12-14T15:36:36Z',
        messageHeadline: '[ghweb300] Navigation can still ' +
            'appear on Login when allowVistors ' +
            'is …',
        repository: 'qualtrax-web',
        issueNumber: '300'
    }
];

describe("gitHubService", () => {
    // test("combineTagsWithCommits has a node for every tag", () => {
    //     const tagsWithCommits = gitHubService.combineTagsWithCommits(tags, commits);

    //     expect(tagsWithCommits.length).toEqual(tags.length);
    // });

    // test("combineTagsWithCommits should include all commits", () => {
    //     const tagsWithCommits = gitHubService.combineTagsWithCommits(tags, commits);
    //     const allCommits = [];
    //     tagsWithCommits.forEach(tagWithCommits => allCommits.push(...tagWithCommits.issues));

    //     expect(allCommits.length).toEqual(commits.length);
    // });

    test("getPreviousTagNumber returns previous tag for minor version", () => {
      const previousTagNumber = gitHubService.getPreviousTagNumber('2015.3.0.1');

      expect(previousTagNumber).toEqual('2015.3.0.0');
    });

    test("getCommitsForMajorRelease returns correct commits for 2019.3.0.0 release", () => {
        const majorTags = tags.filter(tag => tag.isMajor);
        
        const majorCommits = gitHubService.getCommitsForMajorRelease(majorTags[0], majorTags[1], commits);

        expect(majorCommits.length).toEqual(10);
    });

    test("getTagForCommit returns correct tag for commit", () => {
        const commit = {
            committedDate: '2019-08-26T19:54:06Z',
            messageHeadline: '[gh3448] SameSite Cookies without ' +
                'using Rewrites using .Net Upgrade',
            repository: 'qualtrax',
            issueNumber: '3448'
        };

        const tagForCommit = gitHubService.getTagForCommit(commit, tags);

        expect(tagForCommit.name).toEqual('2019.3.0.0');
    });
});