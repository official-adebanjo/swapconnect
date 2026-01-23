import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface Blog {
  id: string;
  title: string;
  image: string;
  price: number;
  excerpt: string;
}

const BlogSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-full shadow-sm">
    <Skeleton className="h-48 w-full" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-4 w-1/3 pt-4" />
    </div>
  </div>
);

const BlogSection: React.FC = () => {
  const {
    data: blogs = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Blog[]>({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await fetch("/json/Blogs.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <section className={cn("container max-w-6xl mx-auto my-20 px-4 md:px-0")}>
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-black mb-4 text-foreground tracking-tight"
        >
          Latest <span className="text-brand-primary">Insights</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-text-secondary max-w-lg mx-auto"
        >
          Stay updated with the latest trends in tech swap, tips for buyers, and
          company news.
        </motion.p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/5 border border-destructive/20 text-destructive p-8 rounded-2xl text-center max-w-xl mx-auto">
          <AlertCircle className="w-10 h-10 mx-auto mb-4" />
          <strong className="block text-xl mb-2">
            Ops! Failed to load blogs
          </strong>
          <p className="opacity-80">{(error as Error).message}</p>
          <Button
            variant="outline-secondary"
            onClick={() => refetch()}
            className="mt-6 border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full"
          >
            Try Again
          </Button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-muted p-12 rounded-3xl text-center border border-dashed border-border max-w-xl mx-auto">
          <p className="text-text-secondary font-medium">
            No blog posts found at the moment. Check back soon!
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex group"
            >
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col w-full relative">
                {/* Image */}
                <div className="relative w-full h-52 overflow-hidden bg-muted">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    Tech Gist
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col grow bg-card transition-colors group-hover:bg-muted/30">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted mb-3 uppercase tracking-wider">
                    <Calendar size={12} className="text-brand-primary" />
                    <span>June 28, 2024</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-text-secondary text-sm line-clamp-3 grow leading-relaxed mb-6">
                    {blog.excerpt}
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-brand-primary font-bold text-sm hover:gap-3 transition-all self-start"
                  >
                    Continue Reading <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default BlogSection;
