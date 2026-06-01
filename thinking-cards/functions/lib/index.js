"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
(0, app_1.initializeApp)();
exports.deleteUser = (0, https_1.onCall)(async (request) => {
    const callerUid = request.auth?.uid;
    if (!callerUid) {
        throw new https_1.HttpsError('unauthenticated', 'Must be logged in.');
    }
    const callerToken = request.auth.token;
    if (!callerToken.admin) {
        throw new https_1.HttpsError('permission-denied', 'Must be an admin.');
    }
    const targetUid = request.data?.uid;
    if (!targetUid || typeof targetUid !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'Must provide a uid string.');
    }
    if (targetUid === callerUid) {
        throw new https_1.HttpsError('invalid-argument', 'Cannot delete your own account.');
    }
    const db = (0, firestore_1.getFirestore)();
    const auth = (0, auth_1.getAuth)();
    // Delete Auth account
    await auth.deleteUser(targetUid);
    // Delete subcollections (favorites, progress)
    const subcollections = ['favorites', 'progress'];
    for (const sub of subcollections) {
        const snap = await db.collection(`users/${targetUid}/${sub}`).get();
        const batch = db.batch();
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
    }
    // Delete user doc
    await db.doc(`users/${targetUid}`).delete();
    return { success: true };
});
//# sourceMappingURL=index.js.map