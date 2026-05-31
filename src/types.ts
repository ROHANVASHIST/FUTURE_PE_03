export interface BusinessInput {
  businessName: string;
  businessType: string;
  city: string;
  area: string;
  services: string;
  primaryKeyword: string;
}

export interface ClusterPlan {
  keywordMap: any;
  cluster: {
    pillar: any;
    supporting: any[];
  };
  internal_link_map: any[];
}

export interface GeneratedBlog {
  meta: {
    title: string;
    meta_description: string;
    target_keyword: string;
  };
  markdownContent: string;
}
