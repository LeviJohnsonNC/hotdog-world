import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Sitemap = () => {
  useEffect(() => {
    const fetchAndDisplaySitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('sitemap');
        
        if (error) {
          console.error('Error fetching sitemap:', error);
          document.body.innerHTML = '<pre>Error loading sitemap</pre>';
          return;
        }

        // Replace the entire document with the XML
        document.open();
        document.write(data);
        document.close();
      } catch (error) {
        console.error('Error loading sitemap:', error);
        document.body.innerHTML = '<pre>Error loading sitemap</pre>';
      }
    };

    fetchAndDisplaySitemap();
  }, []);

  return null;
};

export default Sitemap;
