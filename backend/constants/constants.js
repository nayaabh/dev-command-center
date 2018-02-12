// Types
const ADMIN = "ADMIN"
const APP = "APP"
const ARTIFACT = "ARTIFACT"

// Operations
const FETCH = "FETCH"
const SAVE = "SAVE"
const ACK = "ACK"

const GIT_SYNC = "GIT_SYNC"
const GIT_PULL = "GIT_PULL"
const GIT_PUSH = "GIT_PUSH"
const BUILD_JS = "BUILD_JS"
const TEST_JS = "TEST_JS"
const LINT_FIX_JS = "LINT_FIX_JS"

// VERB Codes
const START = "START"
const IN_PROGRESS = "IN_PROGRESS"
const SUCCESS = "SUCCESS"
const FAILED = "FAILED"

// Property
const REGISTERED_ARTIFACTS = "registeredArtifacts"
const REGISTERED_CONFIGS = "registeredConfigs"

// SERVER
const SERVER_URL = `http://127.0.0.1:4001`
const APP_URL = `${SERVER_URL}/${APP}`
const ARTIFACT_URL = `${SERVER_URL}/${ARTIFACT}`

module.exports = {
    ADMIN,
    APP,
    ARTIFACT,
    ACK,
    GIT_SYNC,
    GIT_PULL,
    GIT_PUSH,
    BUILD_JS,
    TEST_JS,
    LINT_FIX_JS,
    START,
    IN_PROGRESS,
    SUCCESS,
    FAILED,
    FETCH,
    SAVE,
    REGISTERED_ARTIFACTS,
    REGISTERED_CONFIGS,
    SERVER_URL,
    APP_URL,
    ARTIFACT_URL
}