/**
 * Function to generate XAPI statements.
 */
export default function generateStatement(verb) {
  return {
    'timestamp': new Date(),
    'verb': {
      'id': verb
    }
  };
}
