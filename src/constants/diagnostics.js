/**
 * Diagnostic codes produced by the DPN parser and semantics.
 * Texts live in locales (diagnostics:<code>), core returns only the code and params.
 */
export const DIAGNOSTIC = {
    // syntax (dpnParser)
    UNCLOSED_STRING: 'unclosedString',             // -
    UNKNOWN_CHARACTER: 'unknownCharacter',         // char
    UNEXPECTED_TOKEN: 'unexpectedToken',           // expected, found (token types)
    EXPECTED_DECLARATION: 'expectedDeclaration',   // found
    EXPECTED_VALUE: 'expectedValue',               // found

    // semantics (dpnSemantics)
    DUPLICATE_DECLARATION: 'duplicateDeclaration', // name, line
    UNDECLARED_NAME: 'undeclaredName',             // name
    INVALID_ARC_ENDPOINTS: 'invalidArcEndpoints',  // kind (context), from, to
    SPECIAL_ARC_DIRECTION: 'specialArcDirection',  // type
    DUPLICATE_ARC: 'duplicateArc',                 // arc, line
    DUPLICATE_RESET_ARC: 'duplicateResetArc',      // arc, line
    ARC_TYPE_CONFLICT: 'arcTypeConflict',          // arc, line, firstType, type
    RESET_ARC_WEIGHT: 'resetArcWeight',            // arc
    DUPLICATE_ATTRIBUTE: 'duplicateAttribute',     // key, owner, firstKey, line
    UNKNOWN_ATTRIBUTE: 'unknownAttribute',         // key, kind (context), suggestion?
    INVALID_ATTRIBUTE_TYPE: 'invalidAttributeType',     // key, expected (value type)
    INVALID_ATTRIBUTE_OPTION: 'invalidAttributeOption', // key, options
    NOT_CONNECTED: 'notConnected',                 // kind (context), name

    // anything unexpected (bug, missing parser)
    UNKNOWN_ERROR: 'unknownError',                 // details
};

export const DIAGNOSTIC_CODES = Object.values(DIAGNOSTIC);
