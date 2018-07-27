// Action Types

export const FETCH_THREAD_DATA_BEGIN = 'FETCH_THREAD_DATA_BEGIN';
export const FETCH_THREAD_DATA_SUCCESS = 'FETCH_THREAD_DATA_SUCCESS';
export const FETCH_THREAD_DATA_FAILED = 'FETCH_THREAD_DATA_FAILED';
export const FETCH_THREAD_DATA_DISMISS_ERROR = 'FETCH_THREAD_DISMISS_ERROR';

export const CREATE_THREAD_BEGIN = 'CREATE_THREAD_BEGIN';
export const CREATE_THREAD_SUCCESS = 'CREATE_THREAD_SUCCESS';
export const CREATE_THREAD_FAILED = 'CREATE_THREAD_FAILED';
export const CREATE_THREAD_DISMISS_ERROR = 'CREATE_THREAD_DISMISS_ERROR';

// Actions

export const fetchThreadDataBegin = (threadId) => ({type: FETCH_THREAD_DATA_BEGIN, threadId});
export const fetchThreadDataSuccess = (result) => ({type: FETCH_THREAD_DATA_SUCCESS, result});
export const fetchThreadDataFailed = (error) => ({type: FETCH_THREAD_DATA_FAILED, error});
export const fetchThreadDataDismissError = () => ({type: FETCH_THREAD_DATA_DISMISS_ERROR});

export const createThreadBegin = (name, content, userId, subCategoryId, history) => ({type: CREATE_THREAD_BEGIN, name, content, userId, subCategoryId, history});
export const createThreadSuccess = (result) => ({type: CREATE_THREAD_SUCCESS, result});
export const createThreadFailed = (error) => ({type: CREATE_THREAD_FAILED, error});
export const createThreadDismissError = () => ({type: CREATE_THREAD_DISMISS_ERROR});

// Reducer

const initialState = {
    thread: null,
    posts: null,
    loading: false,
    loaded: false,
    errors: []
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {

        case FETCH_THREAD_DATA_BEGIN: 
            const updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case FETCH_THREAD_DATA_SUCCESS: 
            const updatedState = {
                ...state,
                loading: false,
                loaded: true,
                data: action.result,
                errors: []
            }
            return updatedState;
        case FETCH_THREAD_DATA_FAILED: 
            const updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case FETCH_THREAD_DATA_DISMISS_ERROR:
            const updatedState = {
                ...state,
                errors: []
            }
            return updatedState;
        case CREATE_THREAD_BEGIN: 
            const updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case CREATE_THREAD_SUCCESS: 
            const updatedState = {
                ...state,
                loading: false,
                loaded: true,
                data: action.result,
                errors: []
            }
            return updatedState;
        case CREATE_THREAD_FAILED: 
            const updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case CREATE_THREAD_DISMISS_ERROR:
            const updatedState = {
                ...state,
                errors: []
            }
            return updatedState;
        default: return state;
    }
};

export function* fetchThreadDataSaga(action) {
    try {
        const response = yield axios.get(
            "/api/forums/thread/" + action.threadId
        );
        yield put(fetchThreadDataSuccess(response.data));
    } catch (error) {
        yield put(fetchThreadDataFailed(error.response.data));
    }
}

export function* createThreadSaga(action) {
    try {
        const response = yield axios.post(
            "/api/forums/thread/create", {
                name: action.name,
                content: action.content,
                userId: action.userId,
                subCategoryId: action.subCategoryId
            }
        );
        yield action.history.push("/forums" + response.data.path);
        yield put(createThreadSuccess(response.data));
    } catch (error) {
        yield put(createThreadFailed(error.response.data));
    }
}

export function* watchThread() {
    yield takeEvery(FETCH_THREAD_DATA_BEGIN, fetchThreadDataSaga);
    yield takeEvery(CREATE_THREAD_BEGIN, createThreadSaga);
}