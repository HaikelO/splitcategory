<?php




class PluginSplitCategoryITILCategory extends CommonDBTM {
    // Define properties and methods specific to ITIL categories
    
    /**
     * Checks if the user can create an ITIL category
     *
     * @return bool True if user has the right to create, False otherwise
     */
    public static function canCreate() {
        return Session::haveRight('itilcategory', CREATE);
    }

    /**
     * Checks if the user can view ITIL categories
     *
     * @return bool True if user has the right to view, False otherwise
     */
    public static function canView() {
        return Session::haveRight('itilcategory', READ);
    }

    /**
     * Retrieves all ITIL categories from the database.
     * @return array An array of ITIL categories.
     */
    public function getCategories() {
        global $DB; // Access the global DB instance
        $categories = [];
    
        try {
            // Construct the SQL query to fetch all ITIL categories
            $query = "SELECT * FROM glpi_itilcategories";
            $result = $DB->query($query);
            
            // Fetch the results and store them in an array
            if ($result) {
                while ($data = $result->fetch_assoc()) {
                    $categories[] = $data;
                }
            }
            return $categories;
        } catch (Exception $e) {
            // Handle exceptions and return an empty array if there's an error
            error_log('Error fetching ITIL categories: ' . $e->getMessage());
            return [];
        }
    }
    
    
}
?>
