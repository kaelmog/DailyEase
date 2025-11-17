"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoading(false);
      setShowGreeting(true);
    }, 300);

    const redirectTimer = setTimeout(() => router.push("/reports/new"), 2000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-pink-50 px-4">
      {loading && (
        <div className="w-32 h-8 rounded-full bg-pink-200 shimmer"></div>
      )}

      {showGreeting && !loading && (
        <h1 className="text-pink-600 font-bold text-center greeting animate-slide-fade">
          Hi Ayuni!{" "}
          <span className="inline-block animate-heart-bounce">💖</span>
        </h1>
      )}

      <style>{`
        /* Shimmer loading */
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer::before {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.2s infinite;
        }
        @keyframes shimmer {
          0% {
            left: -150%;
          }
          100% {
            left: 100%;
          }
        }

        /* Greeting animation */
        .greeting {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }
        .animate-slide-fade {
          animation: slideFadeIn 0.8s forwards;
        }
        @keyframes slideFadeIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Heart bounce */
        .animate-heart-bounce {
          display: inline-block;
          animation: heartBounce 0.8s ease-in-out infinite alternate;
        }
        @keyframes heartBounce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Responsive font sizes */
        @media (max-width: 375px) {
          .greeting {
            font-size: 2.5rem;
          }
        } /* iPhone X */
        @media (max-width: 414px) {
          .greeting {
            font-size: 3rem;
          }
        } /* iPhone 11 */
        @media (max-width: 411px) {
          .greeting {
            font-size: 2.8rem;
          }
        } /* Redmi Note 8 */
        @media (min-width: 768px) {
          .greeting {
            font-size: 5rem;
          }
        } /* Tablets/desktop */
      `}</style>
    </div>
  );
}
