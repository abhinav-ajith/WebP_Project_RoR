import ClubAddModal from "./MakeClub"

/*

This module is for the system admin to add a new club to the database.
There will be a field for entering the club name and another field for entering the password.

*/

const SysAdminMakeClub = () => {
    return (
      <>
        <ClubAddModal></ClubAddModal>
      </>
    );
  };
  export default SysAdminMakeClub;