import { Roadmap } from './types'
import { generateId } from './utils'

const g = generateId

export const defaultRoadmaps: Roadmap[] = [
  // ─── DSA ROADMAP ─────────────────────────────────────────────────────────────
  {
    id: 'dsa-roadmap',
    name: 'DSA Mastery Roadmap',
    description: 'Complete Data Structures & Algorithms prep from arrays to advanced DP. 10-week structured plan for software engineering interviews.',
    type: 'predefined',
    color: 'violet',
    icon: 'Code2',
    totalWeeks: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    topics: [
      {
        id: 'dsa-t1', name: 'Week 1 — Arrays & Strings', week: 1,
        description: 'Foundation of all DS problems. Master array manipulation, string processing, and common patterns.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t1-s1', name: 'Array Basics & Prefix Sum', description: 'Cumulative sums, range queries',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Running Sum of 1d Array', difficulty: 'easy', number: 1480 },
              { id: g(), title: 'Range Sum Query - Immutable', difficulty: 'easy', number: 303 },
              { id: g(), title: 'Subarray Sum Equals K', difficulty: 'medium', number: 560 },
              { id: g(), title: 'Product of Array Except Self', difficulty: 'medium', number: 238 },
              { id: g(), title: 'Maximum Sum Subarray (Kadane)', difficulty: 'medium', number: 53 },
            ]
          },
          {
            id: 'dsa-t1-s2', name: 'Two Pointers', description: 'Left/right pointer technique for sorted arrays',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Valid Palindrome', difficulty: 'easy', number: 125 },
              { id: g(), title: 'Two Sum II - Input Array Is Sorted', difficulty: 'medium', number: 167 },
              { id: g(), title: 'Container With Most Water', difficulty: 'medium', number: 11 },
              { id: g(), title: '3Sum', difficulty: 'medium', number: 15 },
              { id: g(), title: 'Trapping Rain Water', difficulty: 'hard', number: 42 },
            ]
          },
          {
            id: 'dsa-t1-s3', name: 'Sliding Window', description: 'Fixed and variable size window patterns',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Maximum Average Subarray I', difficulty: 'easy', number: 643 },
              { id: g(), title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', number: 3 },
              { id: g(), title: 'Minimum Size Subarray Sum', difficulty: 'medium', number: 209 },
              { id: g(), title: 'Fruit Into Baskets', difficulty: 'medium', number: 904 },
              { id: g(), title: 'Minimum Window Substring', difficulty: 'hard', number: 76 },
            ]
          },
          {
            id: 'dsa-t1-s4', name: 'String Manipulation', description: 'Anagrams, palindromes, pattern matching',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Valid Anagram', difficulty: 'easy', number: 242 },
              { id: g(), title: 'Group Anagrams', difficulty: 'medium', number: 49 },
              { id: g(), title: 'Longest Palindromic Substring', difficulty: 'medium', number: 5 },
              { id: g(), title: 'String to Integer (atoi)', difficulty: 'medium', number: 8 },
              { id: g(), title: 'Encode and Decode Strings', difficulty: 'medium', number: 271 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t2', name: 'Week 2 — Linked Lists', week: 2,
        description: 'Pointer manipulation, fast/slow pointers, reversals, and merge operations.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t2-s1', name: 'Linked List Basics & Reversal', description: 'Core traversal and in-place reversal',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Reverse Linked List', difficulty: 'easy', number: 206 },
              { id: g(), title: 'Reverse Linked List II', difficulty: 'medium', number: 92 },
              { id: g(), title: 'Remove Nth Node From End of List', difficulty: 'medium', number: 19 },
              { id: g(), title: 'Remove Duplicates from Sorted List', difficulty: 'easy', number: 83 },
              { id: g(), title: 'Delete Node in a Linked List', difficulty: 'medium', number: 237 },
            ]
          },
          {
            id: 'dsa-t2-s2', name: 'Fast & Slow Pointers (Floyd\'s)', description: 'Cycle detection, middle element',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Linked List Cycle', difficulty: 'easy', number: 141 },
              { id: g(), title: 'Linked List Cycle II', difficulty: 'medium', number: 142 },
              { id: g(), title: 'Middle of the Linked List', difficulty: 'easy', number: 876 },
              { id: g(), title: 'Happy Number', difficulty: 'easy', number: 202 },
              { id: g(), title: 'Find the Duplicate Number', difficulty: 'medium', number: 287 },
            ]
          },
          {
            id: 'dsa-t2-s3', name: 'Merge & Sort Linked Lists', description: 'Merge sorted lists, sort list',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Merge Two Sorted Lists', difficulty: 'easy', number: 21 },
              { id: g(), title: 'Merge k Sorted Lists', difficulty: 'hard', number: 23 },
              { id: g(), title: 'Sort List', difficulty: 'medium', number: 148 },
              { id: g(), title: 'Reorder List', difficulty: 'medium', number: 143 },
              { id: g(), title: 'Flatten a Multilevel Doubly Linked List', difficulty: 'medium', number: 430 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t3', name: 'Week 3 — Stacks, Queues & Hashing', week: 3,
        description: 'LIFO/FIFO structures, monotonic stacks, hash maps for O(1) lookups.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t3-s1', name: 'Stack Applications', description: 'Balanced parentheses, expression evaluation',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Valid Parentheses', difficulty: 'easy', number: 20 },
              { id: g(), title: 'Min Stack', difficulty: 'medium', number: 155 },
              { id: g(), title: 'Evaluate Reverse Polish Notation', difficulty: 'medium', number: 150 },
              { id: g(), title: 'Daily Temperatures', difficulty: 'medium', number: 739 },
              { id: g(), title: 'Largest Rectangle in Histogram', difficulty: 'hard', number: 84 },
            ]
          },
          {
            id: 'dsa-t3-s2', name: 'Monotonic Stack', description: 'Next greater element patterns',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Next Greater Element I', difficulty: 'easy', number: 496 },
              { id: g(), title: 'Next Greater Element II', difficulty: 'medium', number: 503 },
              { id: g(), title: 'Remove Duplicate Letters', difficulty: 'medium', number: 316 },
              { id: g(), title: 'Sum of Subarray Minimums', difficulty: 'medium', number: 907 },
              { id: g(), title: 'Maximal Rectangle', difficulty: 'hard', number: 85 },
            ]
          },
          {
            id: 'dsa-t3-s3', name: 'Hashing & Frequency Count', description: 'HashMap/HashSet for O(1) operations',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Two Sum', difficulty: 'easy', number: 1 },
              { id: g(), title: 'Contains Duplicate', difficulty: 'easy', number: 217 },
              { id: g(), title: 'Top K Frequent Elements', difficulty: 'medium', number: 347 },
              { id: g(), title: 'LRU Cache', difficulty: 'medium', number: 146 },
              { id: g(), title: 'Longest Consecutive Sequence', difficulty: 'medium', number: 128 },
            ]
          },
          {
            id: 'dsa-t3-s4', name: 'Deque & Sliding Window Max', description: 'Deque patterns for window problems',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Sliding Window Maximum', difficulty: 'hard', number: 239 },
              { id: g(), title: 'Design Circular Queue', difficulty: 'medium', number: 622 },
              { id: g(), title: 'Number of Recent Calls', difficulty: 'easy', number: 933 },
              { id: g(), title: 'First Unique Character in a String', difficulty: 'easy', number: 387 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t4', name: 'Week 4 — Trees & BST', week: 4,
        description: 'Binary trees, BST operations, traversals, and tree construction problems.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t4-s1', name: 'Tree Traversals (BFS & DFS)', description: 'Inorder, preorder, postorder, level-order',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Binary Tree Inorder Traversal', difficulty: 'easy', number: 94 },
              { id: g(), title: 'Binary Tree Level Order Traversal', difficulty: 'medium', number: 102 },
              { id: g(), title: 'Binary Tree Zigzag Level Order', difficulty: 'medium', number: 103 },
              { id: g(), title: 'Binary Tree Right Side View', difficulty: 'medium', number: 199 },
              { id: g(), title: 'Maximum Depth of Binary Tree', difficulty: 'easy', number: 104 },
            ]
          },
          {
            id: 'dsa-t4-s2', name: 'Tree Path & Ancestor Problems', description: 'Path sum, LCA, diameter',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Path Sum', difficulty: 'easy', number: 112 },
              { id: g(), title: 'Path Sum II', difficulty: 'medium', number: 113 },
              { id: g(), title: 'Binary Tree Maximum Path Sum', difficulty: 'hard', number: 124 },
              { id: g(), title: 'Lowest Common Ancestor of BST', difficulty: 'medium', number: 235 },
              { id: g(), title: 'Diameter of Binary Tree', difficulty: 'easy', number: 543 },
            ]
          },
          {
            id: 'dsa-t4-s3', name: 'BST Operations', description: 'Insert, delete, validate, kth smallest',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Validate Binary Search Tree', difficulty: 'medium', number: 98 },
              { id: g(), title: 'Kth Smallest Element in a BST', difficulty: 'medium', number: 230 },
              { id: g(), title: 'Convert Sorted Array to BST', difficulty: 'easy', number: 108 },
              { id: g(), title: 'Delete Node in a BST', difficulty: 'medium', number: 450 },
              { id: g(), title: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', number: 297 },
            ]
          },
          {
            id: 'dsa-t4-s4', name: 'Trie (Prefix Tree)', description: 'Insert, search, prefix matching',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Implement Trie (Prefix Tree)', difficulty: 'medium', number: 208 },
              { id: g(), title: 'Design Add and Search Words Data Structure', difficulty: 'medium', number: 211 },
              { id: g(), title: 'Word Search II', difficulty: 'hard', number: 212 },
              { id: g(), title: 'Longest Word in Dictionary', difficulty: 'medium', number: 720 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t5', name: 'Week 5 — Heaps & Priority Queues', week: 5,
        description: 'Min/max heaps, heap sort, scheduling problems, and top-K patterns.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t5-s1', name: 'Top K Pattern', description: 'Using heaps for top-K elements',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Kth Largest Element in an Array', difficulty: 'medium', number: 215 },
              { id: g(), title: 'Top K Frequent Elements', difficulty: 'medium', number: 347 },
              { id: g(), title: 'K Closest Points to Origin', difficulty: 'medium', number: 973 },
              { id: g(), title: 'Sort Characters By Frequency', difficulty: 'medium', number: 451 },
              { id: g(), title: 'Find Median from Data Stream', difficulty: 'hard', number: 295 },
            ]
          },
          {
            id: 'dsa-t5-s2', name: 'K-way Merge', description: 'Merging K sorted arrays/lists',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Merge k Sorted Lists', difficulty: 'hard', number: 23 },
              { id: g(), title: 'Smallest Range Covering Elements from K Lists', difficulty: 'hard', number: 632 },
              { id: g(), title: 'Find K Pairs with Smallest Sums', difficulty: 'medium', number: 373 },
              { id: g(), title: 'Kth Smallest Element in a Sorted Matrix', difficulty: 'medium', number: 378 },
            ]
          },
          {
            id: 'dsa-t5-s3', name: 'Task Scheduling', description: 'Interval and scheduling with heaps',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Task Scheduler', difficulty: 'medium', number: 621 },
              { id: g(), title: 'Meeting Rooms II', difficulty: 'medium', number: 253 },
              { id: g(), title: 'Reorganize String', difficulty: 'medium', number: 767 },
              { id: g(), title: 'IPO', difficulty: 'hard', number: 502 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t6', name: 'Week 6 — Graphs', week: 6,
        description: 'BFS, DFS, topological sort, shortest paths (Dijkstra), and Union-Find.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t6-s1', name: 'Graph BFS', description: 'Shortest path in unweighted graphs',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Number of Islands', difficulty: 'medium', number: 200 },
              { id: g(), title: 'Rotting Oranges', difficulty: 'medium', number: 994 },
              { id: g(), title: 'Word Ladder', difficulty: 'hard', number: 127 },
              { id: g(), title: 'Walls and Gates', difficulty: 'medium', number: 286 },
              { id: g(), title: 'Pacific Atlantic Water Flow', difficulty: 'medium', number: 417 },
            ]
          },
          {
            id: 'dsa-t6-s2', name: 'Graph DFS', description: 'Connected components, cycles',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Max Area of Island', difficulty: 'medium', number: 695 },
              { id: g(), title: 'Course Schedule', difficulty: 'medium', number: 207 },
              { id: g(), title: 'Course Schedule II', difficulty: 'medium', number: 210 },
              { id: g(), title: 'Number of Connected Components', difficulty: 'medium', number: 323 },
              { id: g(), title: 'Graph Valid Tree', difficulty: 'medium', number: 261 },
            ]
          },
          {
            id: 'dsa-t6-s3', name: 'Shortest Path (Dijkstra)', description: 'Weighted graph shortest paths',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Network Delay Time', difficulty: 'medium', number: 743 },
              { id: g(), title: 'Cheapest Flights Within K Stops', difficulty: 'medium', number: 787 },
              { id: g(), title: 'Path with Minimum Effort', difficulty: 'medium', number: 1631 },
              { id: g(), title: 'Find the City With the Smallest Number of Neighbors', difficulty: 'medium', number: 1334 },
            ]
          },
          {
            id: 'dsa-t6-s4', name: 'Union Find (Disjoint Set)', description: 'Connected components with union-find',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Number of Provinces', difficulty: 'medium', number: 547 },
              { id: g(), title: 'Redundant Connection', difficulty: 'medium', number: 684 },
              { id: g(), title: 'Accounts Merge', difficulty: 'medium', number: 721 },
              { id: g(), title: 'Number of Operations to Make Network Connected', difficulty: 'medium', number: 1319 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t7', name: 'Week 7 — Dynamic Programming I', week: 7,
        description: '1D DP: Fibonacci variants, house robber, and classic optimization problems.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t7-s1', name: '1D DP — Linear', description: 'Fibonacci pattern, memoization',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Climbing Stairs', difficulty: 'easy', number: 70 },
              { id: g(), title: 'House Robber', difficulty: 'medium', number: 198 },
              { id: g(), title: 'House Robber II', difficulty: 'medium', number: 213 },
              { id: g(), title: 'Decode Ways', difficulty: 'medium', number: 91 },
              { id: g(), title: 'Jump Game', difficulty: 'medium', number: 55 },
              { id: g(), title: 'Jump Game II', difficulty: 'medium', number: 45 },
            ]
          },
          {
            id: 'dsa-t7-s2', name: '1D DP — Subsequences', description: 'LIS, coin change patterns',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Longest Increasing Subsequence', difficulty: 'medium', number: 300 },
              { id: g(), title: 'Coin Change', difficulty: 'medium', number: 322 },
              { id: g(), title: 'Coin Change II', difficulty: 'medium', number: 518 },
              { id: g(), title: 'Word Break', difficulty: 'medium', number: 139 },
              { id: g(), title: 'Partition Equal Subset Sum', difficulty: 'medium', number: 416 },
            ]
          },
          {
            id: 'dsa-t7-s3', name: '2D DP — Grid & Matrix', description: 'Grid paths, minimum cost',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Unique Paths', difficulty: 'medium', number: 62 },
              { id: g(), title: 'Minimum Path Sum', difficulty: 'medium', number: 64 },
              { id: g(), title: 'Triangle', difficulty: 'medium', number: 120 },
              { id: g(), title: 'Maximal Square', difficulty: 'medium', number: 221 },
              { id: g(), title: 'Dungeon Game', difficulty: 'hard', number: 174 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t8', name: 'Week 8 — Dynamic Programming II', week: 8,
        description: 'String DP (LCS, edit distance), Knapsack variations, and interval DP.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t8-s1', name: 'String DP', description: 'LCS, edit distance, palindromes',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Longest Common Subsequence', difficulty: 'medium', number: 1143 },
              { id: g(), title: 'Edit Distance', difficulty: 'hard', number: 72 },
              { id: g(), title: 'Longest Palindromic Subsequence', difficulty: 'medium', number: 516 },
              { id: g(), title: 'Palindromic Substrings', difficulty: 'medium', number: 647 },
              { id: g(), title: 'Interleaving String', difficulty: 'hard', number: 97 },
            ]
          },
          {
            id: 'dsa-t8-s2', name: 'Knapsack Variations', description: '0/1 Knapsack, unbounded, multiple',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Target Sum', difficulty: 'medium', number: 494 },
              { id: g(), title: 'Ones and Zeroes', difficulty: 'medium', number: 474 },
              { id: g(), title: 'Last Stone Weight II', difficulty: 'medium', number: 1049 },
              { id: g(), title: 'Minimum Cost For Tickets', difficulty: 'medium', number: 983 },
            ]
          },
          {
            id: 'dsa-t8-s3', name: 'DP on Trees & States', description: 'Tree DP, state machine DP',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', number: 121 },
              { id: g(), title: 'Best Time to Buy and Sell Stock III', difficulty: 'hard', number: 123 },
              { id: g(), title: 'Best Time to Buy and Sell Stock IV', difficulty: 'hard', number: 188 },
              { id: g(), title: 'House Robber III (Tree DP)', difficulty: 'medium', number: 337 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t9', name: 'Week 9 — Sorting, Searching & Binary Search', week: 9,
        description: 'Binary search variants, merge sort, quick select, and search in rotated arrays.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t9-s1', name: 'Binary Search Basics', description: 'Classic and boundary conditions',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Binary Search', difficulty: 'easy', number: 704 },
              { id: g(), title: 'Search in Rotated Sorted Array', difficulty: 'medium', number: 33 },
              { id: g(), title: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium', number: 153 },
              { id: g(), title: 'Find First and Last Position of Element', difficulty: 'medium', number: 34 },
              { id: g(), title: 'Search a 2D Matrix', difficulty: 'medium', number: 74 },
            ]
          },
          {
            id: 'dsa-t9-s2', name: 'Binary Search on Answer', description: 'Predicate-based binary search',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Koko Eating Bananas', difficulty: 'medium', number: 875 },
              { id: g(), title: 'Minimum Number of Days to Make m Bouquets', difficulty: 'medium', number: 1482 },
              { id: g(), title: 'Split Array Largest Sum', difficulty: 'hard', number: 410 },
              { id: g(), title: 'Capacity To Ship Packages Within D Days', difficulty: 'medium', number: 1011 },
            ]
          },
          {
            id: 'dsa-t9-s3', name: 'Merge Sort & Quick Select', description: 'Divide and conquer sorting',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Sort an Array', difficulty: 'medium', number: 912 },
              { id: g(), title: 'Kth Largest Element in an Array (Quick Select)', difficulty: 'medium', number: 215 },
              { id: g(), title: 'Count of Smaller Numbers After Self', difficulty: 'hard', number: 315 },
              { id: g(), title: 'Merge Intervals', difficulty: 'medium', number: 56 },
            ]
          },
        ]
      },
      {
        id: 'dsa-t10', name: 'Week 10 — Greedy & Backtracking', week: 10,
        description: 'Greedy choices, interval scheduling, and complete search with backtracking.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'dsa-t10-s1', name: 'Greedy Algorithms', description: 'Local optimal → global optimal',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Meeting Rooms', difficulty: 'easy', number: 252 },
              { id: g(), title: 'Non-overlapping Intervals', difficulty: 'medium', number: 435 },
              { id: g(), title: 'Gas Station', difficulty: 'medium', number: 134 },
              { id: g(), title: 'Hand of Straights', difficulty: 'medium', number: 846 },
              { id: g(), title: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'medium', number: 452 },
            ]
          },
          {
            id: 'dsa-t10-s2', name: 'Backtracking — Subsets & Combinations', description: 'Generate all valid combinations',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Subsets', difficulty: 'medium', number: 78 },
              { id: g(), title: 'Subsets II', difficulty: 'medium', number: 90 },
              { id: g(), title: 'Combination Sum', difficulty: 'medium', number: 39 },
              { id: g(), title: 'Combination Sum II', difficulty: 'medium', number: 40 },
              { id: g(), title: 'Permutations', difficulty: 'medium', number: 46 },
            ]
          },
          {
            id: 'dsa-t10-s3', name: 'Backtracking — Hard', description: 'N-Queens, Sudoku solver',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'N-Queens', difficulty: 'hard', number: 51 },
              { id: g(), title: 'Sudoku Solver', difficulty: 'hard', number: 37 },
              { id: g(), title: 'Word Search', difficulty: 'medium', number: 79 },
              { id: g(), title: 'Palindrome Partitioning', difficulty: 'medium', number: 131 },
            ]
          },
        ]
      },
    ]
  },

  // ─── LEETCODE PATTERNS ROADMAP ────────────────────────────────────────────────
  {
    id: 'lc-patterns',
    name: 'LeetCode Patterns',
    description: 'Master 16 core coding patterns used in 90%+ of interview problems. 200+ problems grouped for pattern recognition.',
    type: 'predefined',
    color: 'amber',
    icon: 'Zap',
    totalWeeks: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    topics: [
      {
        id: 'lc-t1', name: 'Pattern 1 — Sliding Window', week: 1,
        description: 'Use when asked for max/min/longest/shortest of a contiguous subarray/substring.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t1-s1', name: 'Fixed Size Window', description: 'Window size given in problem',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Maximum Average Subarray I', difficulty: 'easy', number: 643 },
              { id: g(), title: 'Maximum Sum of Two Non-Overlapping Subarrays', difficulty: 'medium', number: 1031 },
              { id: g(), title: 'Substrings of Size Three with Distinct Characters', difficulty: 'easy', number: 1876 },
            ]
          },
          {
            id: 'lc-t1-s2', name: 'Variable Size Window', description: 'Expand/shrink based on condition',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', number: 3 },
              { id: g(), title: 'Minimum Size Subarray Sum', difficulty: 'medium', number: 209 },
              { id: g(), title: 'Fruit Into Baskets', difficulty: 'medium', number: 904 },
              { id: g(), title: 'Longest Repeating Character Replacement', difficulty: 'medium', number: 424 },
              { id: g(), title: 'Permutation in String', difficulty: 'medium', number: 567 },
              { id: g(), title: 'Minimum Window Substring', difficulty: 'hard', number: 76 },
              { id: g(), title: 'Substring with Concatenation of All Words', difficulty: 'hard', number: 30 },
            ]
          },
        ]
      },
      {
        id: 'lc-t2', name: 'Pattern 2 — Two Pointers', week: 1,
        description: 'Two indices traversing array (same or opposite directions). Often for sorted arrays.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t2-s1', name: 'Opposite Direction', description: 'Start from both ends, converge',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Valid Palindrome', difficulty: 'easy', number: 125 },
              { id: g(), title: 'Two Sum II', difficulty: 'medium', number: 167 },
              { id: g(), title: 'Container With Most Water', difficulty: 'medium', number: 11 },
              { id: g(), title: '3Sum', difficulty: 'medium', number: 15 },
              { id: g(), title: '4Sum', difficulty: 'medium', number: 18 },
              { id: g(), title: 'Trapping Rain Water', difficulty: 'hard', number: 42 },
            ]
          },
          {
            id: 'lc-t2-s2', name: 'Same Direction', description: 'Slow and fast pointer in same direction',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Remove Duplicates from Sorted Array', difficulty: 'easy', number: 26 },
              { id: g(), title: 'Move Zeroes', difficulty: 'easy', number: 283 },
              { id: g(), title: 'Squares of a Sorted Array', difficulty: 'easy', number: 977 },
              { id: g(), title: 'Sort Colors (Dutch National Flag)', difficulty: 'medium', number: 75 },
            ]
          },
        ]
      },
      {
        id: 'lc-t3', name: 'Pattern 3 — Fast & Slow Pointers', week: 2,
        description: 'Floyd\'s cycle detection. Use for cycle detection, middle of list, nth from end.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t3-s1', name: 'Cycle Detection', description: 'Detect and find start of cycle',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Linked List Cycle', difficulty: 'easy', number: 141 },
              { id: g(), title: 'Linked List Cycle II', difficulty: 'medium', number: 142 },
              { id: g(), title: 'Happy Number', difficulty: 'easy', number: 202 },
              { id: g(), title: 'Find the Duplicate Number', difficulty: 'medium', number: 287 },
              { id: g(), title: 'Circular Array Loop', difficulty: 'medium', number: 457 },
            ]
          },
        ]
      },
      {
        id: 'lc-t4', name: 'Pattern 4 — Merge Intervals', week: 2,
        description: 'Sort by start time, then greedily merge overlapping intervals.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t4-s1', name: 'Interval Merge & Insert', description: 'Combine overlapping intervals',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Merge Intervals', difficulty: 'medium', number: 56 },
              { id: g(), title: 'Insert Interval', difficulty: 'medium', number: 57 },
              { id: g(), title: 'Meeting Rooms', difficulty: 'easy', number: 252 },
              { id: g(), title: 'Meeting Rooms II', difficulty: 'medium', number: 253 },
              { id: g(), title: 'Non-overlapping Intervals', difficulty: 'medium', number: 435 },
              { id: g(), title: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'medium', number: 452 },
            ]
          },
        ]
      },
      {
        id: 'lc-t5', name: 'Pattern 5 — Cyclic Sort', week: 3,
        description: 'Place elements in their correct index. Used with arrays containing 1 to N numbers.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t5-s1', name: 'Find Missing/Duplicate Numbers', description: 'Place-based O(n) detection',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Missing Number', difficulty: 'easy', number: 268 },
              { id: g(), title: 'Find All Numbers Disappeared in an Array', difficulty: 'easy', number: 448 },
              { id: g(), title: 'Find the Duplicate Number', difficulty: 'medium', number: 287 },
              { id: g(), title: 'Find All Duplicates in an Array', difficulty: 'medium', number: 442 },
              { id: g(), title: 'First Missing Positive', difficulty: 'hard', number: 41 },
            ]
          },
        ]
      },
      {
        id: 'lc-t6', name: 'Pattern 6 — In-place Reversal (Linked List)', week: 3,
        description: 'Reverse linked list nodes in place without extra space.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t6-s1', name: 'Partial and Full Reversals', description: 'Sub-list reversal patterns',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Reverse Linked List', difficulty: 'easy', number: 206 },
              { id: g(), title: 'Reverse Linked List II', difficulty: 'medium', number: 92 },
              { id: g(), title: 'Reverse Nodes in k-Group', difficulty: 'hard', number: 25 },
              { id: g(), title: 'Rotate List', difficulty: 'medium', number: 61 },
              { id: g(), title: 'Reorder List', difficulty: 'medium', number: 143 },
            ]
          },
        ]
      },
      {
        id: 'lc-t7', name: 'Pattern 7 — Tree BFS', week: 4,
        description: 'Level-order traversal using a queue. Good for shortest path in unweighted graphs.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t7-s1', name: 'Level Order Traversal', description: 'Process nodes level by level',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Binary Tree Level Order Traversal', difficulty: 'medium', number: 102 },
              { id: g(), title: 'Binary Tree Zigzag Level Order', difficulty: 'medium', number: 103 },
              { id: g(), title: 'Average of Levels in Binary Tree', difficulty: 'easy', number: 637 },
              { id: g(), title: 'Binary Tree Right Side View', difficulty: 'medium', number: 199 },
              { id: g(), title: 'Find Largest Value in Each Tree Row', difficulty: 'medium', number: 515 },
              { id: g(), title: 'Populating Next Right Pointers', difficulty: 'medium', number: 116 },
              { id: g(), title: 'Maximum Width of Binary Tree', difficulty: 'medium', number: 662 },
            ]
          },
        ]
      },
      {
        id: 'lc-t8', name: 'Pattern 8 — Tree DFS', week: 4,
        description: 'Preorder/inorder/postorder DFS. Great for path problems and tree construction.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t8-s1', name: 'Tree Path Problems', description: 'Root-to-leaf paths, path sums',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Path Sum', difficulty: 'easy', number: 112 },
              { id: g(), title: 'Path Sum II', difficulty: 'medium', number: 113 },
              { id: g(), title: 'Sum Root to Leaf Numbers', difficulty: 'medium', number: 129 },
              { id: g(), title: 'Binary Tree Maximum Path Sum', difficulty: 'hard', number: 124 },
              { id: g(), title: 'Diameter of Binary Tree', difficulty: 'easy', number: 543 },
            ]
          },
          {
            id: 'lc-t8-s2', name: 'Tree Construction & Ancestors', description: 'Build tree from traversals, LCA',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'medium', number: 105 },
              { id: g(), title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'medium', number: 236 },
              { id: g(), title: 'Invert Binary Tree', difficulty: 'easy', number: 226 },
              { id: g(), title: 'Balanced Binary Tree', difficulty: 'easy', number: 110 },
              { id: g(), title: 'Symmetric Tree', difficulty: 'easy', number: 101 },
            ]
          },
        ]
      },
      {
        id: 'lc-t9', name: 'Pattern 9 — Subsets / Backtracking', week: 5,
        description: 'Generate all combinations, permutations, or subsets. Use recursion with choices.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t9-s1', name: 'Subsets & Combinations', description: 'All subsets, combination sum',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Subsets', difficulty: 'medium', number: 78 },
              { id: g(), title: 'Subsets II', difficulty: 'medium', number: 90 },
              { id: g(), title: 'Combination Sum', difficulty: 'medium', number: 39 },
              { id: g(), title: 'Combination Sum II', difficulty: 'medium', number: 40 },
              { id: g(), title: 'Combinations', difficulty: 'medium', number: 77 },
            ]
          },
          {
            id: 'lc-t9-s2', name: 'Permutations', description: 'All arrangements of elements',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Permutations', difficulty: 'medium', number: 46 },
              { id: g(), title: 'Permutations II (with duplicates)', difficulty: 'medium', number: 47 },
              { id: g(), title: 'Letter Combinations of a Phone Number', difficulty: 'medium', number: 17 },
              { id: g(), title: 'Generate Parentheses', difficulty: 'medium', number: 22 },
              { id: g(), title: 'Palindrome Partitioning', difficulty: 'medium', number: 131 },
            ]
          },
        ]
      },
      {
        id: 'lc-t10', name: 'Pattern 10 — Modified Binary Search', week: 6,
        description: 'Binary search on rotated arrays, 2D matrices, or search space (search on answer).',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t10-s1', name: 'Binary Search Variants', description: 'Rotated arrays, 2D matrices',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Binary Search', difficulty: 'easy', number: 704 },
              { id: g(), title: 'Search in Rotated Sorted Array', difficulty: 'medium', number: 33 },
              { id: g(), title: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium', number: 153 },
              { id: g(), title: 'Search a 2D Matrix', difficulty: 'medium', number: 74 },
              { id: g(), title: 'Find Peak Element', difficulty: 'medium', number: 162 },
            ]
          },
          {
            id: 'lc-t10-s2', name: 'Binary Search on Answer', description: 'Abstract search space',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Koko Eating Bananas', difficulty: 'medium', number: 875 },
              { id: g(), title: 'Capacity To Ship Packages Within D Days', difficulty: 'medium', number: 1011 },
              { id: g(), title: 'Split Array Largest Sum', difficulty: 'hard', number: 410 },
              { id: g(), title: 'Minimum Days to Make m Bouquets', difficulty: 'medium', number: 1482 },
              { id: g(), title: 'Find the Smallest Divisor', difficulty: 'medium', number: 1283 },
            ]
          },
        ]
      },
      {
        id: 'lc-t11', name: 'Pattern 11 — Bit Manipulation', week: 7,
        description: 'XOR tricks, bit counting, power of two checks. Often O(1) solutions.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t11-s1', name: 'XOR & Bit Tricks', description: 'Single number, missing number',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Single Number', difficulty: 'easy', number: 136 },
              { id: g(), title: 'Single Number II', difficulty: 'medium', number: 137 },
              { id: g(), title: 'Single Number III', difficulty: 'medium', number: 260 },
              { id: g(), title: 'Missing Number', difficulty: 'easy', number: 268 },
              { id: g(), title: 'Counting Bits', difficulty: 'easy', number: 338 },
              { id: g(), title: 'Reverse Bits', difficulty: 'easy', number: 190 },
              { id: g(), title: 'Number of 1 Bits', difficulty: 'easy', number: 191 },
              { id: g(), title: 'Power of Two', difficulty: 'easy', number: 231 },
              { id: g(), title: 'Sum of Two Integers (no + operator)', difficulty: 'medium', number: 371 },
              { id: g(), title: 'Decode XORed Array', difficulty: 'easy', number: 1720 },
            ]
          },
        ]
      },
      {
        id: 'lc-t12', name: 'Pattern 12 — Top K Elements', week: 8,
        description: 'Use min/max heap to efficiently find top K elements without full sort.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t12-s1', name: 'Top K with Heap', description: 'Kth largest/smallest using heap',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Kth Largest Element in an Array', difficulty: 'medium', number: 215 },
              { id: g(), title: 'K Closest Points to Origin', difficulty: 'medium', number: 973 },
              { id: g(), title: 'Top K Frequent Elements', difficulty: 'medium', number: 347 },
              { id: g(), title: 'Sort Characters By Frequency', difficulty: 'medium', number: 451 },
              { id: g(), title: 'Reorganize String', difficulty: 'medium', number: 767 },
              { id: g(), title: 'Find Median from Data Stream', difficulty: 'hard', number: 295 },
              { id: g(), title: 'Sliding Window Median', difficulty: 'hard', number: 480 },
            ]
          },
        ]
      },
      {
        id: 'lc-t13', name: 'Pattern 13 — K-way Merge', week: 8,
        description: 'Merge K sorted arrays/lists using a min-heap. Extends merge sort.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t13-s1', name: 'K-way Merge Problems', description: 'Multiple sorted sequences',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Merge k Sorted Lists', difficulty: 'hard', number: 23 },
              { id: g(), title: 'Kth Smallest Element in a Sorted Matrix', difficulty: 'medium', number: 378 },
              { id: g(), title: 'Find K Pairs with Smallest Sums', difficulty: 'medium', number: 373 },
              { id: g(), title: 'Smallest Range Covering Elements from K Lists', difficulty: 'hard', number: 632 },
            ]
          },
        ]
      },
      {
        id: 'lc-t14', name: 'Pattern 14 — Topological Sort', week: 9,
        description: 'Order vertices in a DAG. Used for scheduling, dependency resolution.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t14-s1', name: 'Topological Order Problems', description: 'Kahn\'s algorithm / DFS-based',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Course Schedule', difficulty: 'medium', number: 207 },
              { id: g(), title: 'Course Schedule II', difficulty: 'medium', number: 210 },
              { id: g(), title: 'Alien Dictionary', difficulty: 'hard', number: 269 },
              { id: g(), title: 'Sequence Reconstruction', difficulty: 'medium', number: 444 },
              { id: g(), title: 'Minimum Height Trees', difficulty: 'medium', number: 310 },
              { id: g(), title: 'Find All Possible Recipes from Given Supplies', difficulty: 'medium', number: 2115 },
            ]
          },
        ]
      },
      {
        id: 'lc-t15', name: 'Pattern 15 — Union Find (Disjoint Set)', week: 9,
        description: 'Efficiently track connected components. Near O(1) union and find operations.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t15-s1', name: 'Union Find Applications', description: 'Connected components, cycle detection',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Number of Provinces', difficulty: 'medium', number: 547 },
              { id: g(), title: 'Redundant Connection', difficulty: 'medium', number: 684 },
              { id: g(), title: 'Accounts Merge', difficulty: 'medium', number: 721 },
              { id: g(), title: 'Graph Valid Tree', difficulty: 'medium', number: 261 },
              { id: g(), title: 'Number of Connected Components in Undirected Graph', difficulty: 'medium', number: 323 },
              { id: g(), title: 'Most Stones Removed with Same Row or Column', difficulty: 'medium', number: 947 },
            ]
          },
        ]
      },
      {
        id: 'lc-t16', name: 'Pattern 16 — Dynamic Programming Variations', week: 10,
        description: 'DP sub-patterns: LIS, LCS, Knapsack, Interval DP, Bitmask DP.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'lc-t16-s1', name: 'DP — Classic Sequences', description: 'LIS, LCS, edit distance',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Longest Increasing Subsequence', difficulty: 'medium', number: 300 },
              { id: g(), title: 'Number of Longest Increasing Subsequences', difficulty: 'medium', number: 673 },
              { id: g(), title: 'Longest Common Subsequence', difficulty: 'medium', number: 1143 },
              { id: g(), title: 'Edit Distance', difficulty: 'hard', number: 72 },
              { id: g(), title: 'Longest Palindromic Subsequence', difficulty: 'medium', number: 516 },
            ]
          },
          {
            id: 'lc-t16-s2', name: 'DP — Knapsack', description: '0/1 knapsack and variations',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Partition Equal Subset Sum', difficulty: 'medium', number: 416 },
              { id: g(), title: 'Target Sum', difficulty: 'medium', number: 494 },
              { id: g(), title: 'Coin Change', difficulty: 'medium', number: 322 },
              { id: g(), title: 'Coin Change II', difficulty: 'medium', number: 518 },
              { id: g(), title: 'Ones and Zeroes', difficulty: 'medium', number: 474 },
            ]
          },
          {
            id: 'lc-t16-s3', name: 'DP — Hard Problems', description: 'Interval DP, state machine DP',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Burst Balloons', difficulty: 'hard', number: 312 },
              { id: g(), title: 'Regular Expression Matching', difficulty: 'hard', number: 10 },
              { id: g(), title: 'Wildcard Matching', difficulty: 'hard', number: 44 },
              { id: g(), title: 'Distinct Subsequences', difficulty: 'hard', number: 115 },
              { id: g(), title: 'Best Time to Buy and Sell Stock IV', difficulty: 'hard', number: 188 },
            ]
          },
        ]
      },
    ]
  },

  // ─── SYSTEM DESIGN ROADMAP ────────────────────────────────────────────────────
  {
    id: 'system-design',
    name: 'System Design Roadmap',
    description: 'Master LLD and HLD for senior SWE interviews. From OOP principles to designing Twitter, Netflix, and Uber.',
    type: 'predefined',
    color: 'emerald',
    icon: 'Layers',
    totalWeeks: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    topics: [
      {
        id: 'sd-t1', name: 'Week 1 — Fundamentals & Scale', week: 1,
        description: 'Core concepts every system designer must know: scale, CAP theorem, consistency.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'sd-t1-s1', name: 'Scalability Basics', description: 'Vertical vs horizontal scaling, bottlenecks',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'What is horizontal vs vertical scaling?', difficulty: 'easy' },
              { id: g(), title: 'Explain single point of failure and how to avoid it', difficulty: 'medium' },
              { id: g(), title: 'How do you scale a read-heavy vs write-heavy system?', difficulty: 'medium' },
              { id: g(), title: 'What is back-of-the-envelope estimation?', difficulty: 'easy' },
            ]
          },
          {
            id: 'sd-t1-s2', name: 'CAP Theorem & Consistency', description: 'Consistency, availability, partition tolerance',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Explain CAP theorem with real-world examples', difficulty: 'medium' },
              { id: g(), title: 'Strong vs eventual consistency — when to use each?', difficulty: 'medium' },
              { id: g(), title: 'What is ACID? What is BASE?', difficulty: 'easy' },
              { id: g(), title: 'Difference between CP and AP systems', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t1-s3', name: 'Networking Basics', description: 'HTTP, TCP/UDP, REST vs gRPC',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'What happens when you type google.com?', difficulty: 'medium' },
              { id: g(), title: 'REST vs GraphQL vs gRPC — tradeoffs', difficulty: 'medium' },
              { id: g(), title: 'WebSockets vs Long Polling vs SSE', difficulty: 'medium' },
              { id: g(), title: 'What is DNS? How does DNS resolution work?', difficulty: 'easy' },
            ]
          },
        ]
      },
      {
        id: 'sd-t2', name: 'Week 2 — Low Level Design (OOP & Patterns)', week: 2,
        description: 'Object-Oriented Design, SOLID principles, and design patterns for LLD interviews.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'sd-t2-s1', name: 'OOP & SOLID Principles', description: 'Classes, inheritance, polymorphism',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Explain SOLID principles with examples', difficulty: 'medium' },
              { id: g(), title: 'When to use composition vs inheritance?', difficulty: 'medium' },
              { id: g(), title: 'Design a generic Stack/Queue class in TypeScript', difficulty: 'easy' },
            ]
          },
          {
            id: 'sd-t2-s2', name: 'Design Patterns', description: 'Singleton, Factory, Observer, Strategy',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Implement the Singleton pattern — thread-safe', difficulty: 'medium' },
              { id: g(), title: 'Implement Observer pattern (pub/sub)', difficulty: 'medium' },
              { id: g(), title: 'Factory vs Abstract Factory pattern', difficulty: 'medium' },
              { id: g(), title: 'Strategy pattern — sorting algorithms example', difficulty: 'medium' },
              { id: g(), title: 'Decorator pattern — coffee shop example', difficulty: 'medium' },
            ]
          },
          {
            id: 'sd-t2-s3', name: 'LLD: Parking Lot', description: 'Classic LLD problem with multiple vehicle types',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Design classes for a multi-floor parking lot', difficulty: 'medium' },
              { id: g(), title: 'Handle different vehicle types (bike, car, truck)', difficulty: 'medium' },
              { id: g(), title: 'Implement pricing strategy (hourly, flat rate)', difficulty: 'medium' },
              { id: g(), title: 'Add reservation and availability tracking', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t2-s4', name: 'LLD: Elevator System', description: 'State machine, scheduling algorithms',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Design elevator class hierarchy', difficulty: 'medium' },
              { id: g(), title: 'Implement SCAN disk scheduling algorithm', difficulty: 'hard' },
              { id: g(), title: 'Handle multiple elevators with dispatcher', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t2-s5', name: 'LLD: Chess / Tic-Tac-Toe', description: 'Game engine design, move validation',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Design Chess board with piece hierarchy', difficulty: 'hard' },
              { id: g(), title: 'Implement move validation for each piece type', difficulty: 'hard' },
              { id: g(), title: 'Design Tic-Tac-Toe with extensible win condition', difficulty: 'medium' },
            ]
          },
        ]
      },
      {
        id: 'sd-t3', name: 'Week 3 — Databases & Storage', week: 3,
        description: 'SQL vs NoSQL, indexing, sharding, and choosing the right storage for the problem.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'sd-t3-s1', name: 'SQL vs NoSQL', description: 'When to use relational vs document/column store',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'SQL vs NoSQL — when to choose each?', difficulty: 'medium' },
              { id: g(), title: 'Explain database normalization (1NF, 2NF, 3NF)', difficulty: 'medium' },
              { id: g(), title: 'What is a database index? B-tree vs Hash index', difficulty: 'medium' },
              { id: g(), title: 'Explain query optimization and EXPLAIN plan', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t3-s2', name: 'Database Scaling', description: 'Replication, sharding, partitioning',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Master-slave replication vs peer-to-peer', difficulty: 'medium' },
              { id: g(), title: 'Horizontal sharding strategies (range, hash, directory)', difficulty: 'hard' },
              { id: g(), title: 'Consistent hashing for distributed systems', difficulty: 'hard' },
              { id: g(), title: 'Read replicas — how and when to use them', difficulty: 'medium' },
            ]
          },
          {
            id: 'sd-t3-s3', name: 'Caching', description: 'Cache strategies, Redis, eviction policies',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Cache aside vs write-through vs write-behind', difficulty: 'medium' },
              { id: g(), title: 'LRU vs LFU cache eviction — when to choose?', difficulty: 'medium' },
              { id: g(), title: 'What is cache invalidation? How to handle it?', difficulty: 'hard' },
              { id: g(), title: 'Redis data structures and use cases', difficulty: 'medium' },
              { id: g(), title: 'CDN — how it works, when to use', difficulty: 'easy' },
            ]
          },
        ]
      },
      {
        id: 'sd-t4', name: 'Week 4 — Infrastructure Components', week: 4,
        description: 'Load balancers, message queues, CDN, rate limiting — building blocks of large systems.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'sd-t4-s1', name: 'Load Balancing', description: 'Algorithms, health checks, sticky sessions',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Round robin vs least connections vs IP hash', difficulty: 'easy' },
              { id: g(), title: 'Layer 4 vs Layer 7 load balancing', difficulty: 'medium' },
              { id: g(), title: 'How to handle session stickiness in a load balanced system', difficulty: 'medium' },
            ]
          },
          {
            id: 'sd-t4-s2', name: 'Message Queues & Event Streaming', description: 'Kafka, RabbitMQ, async processing',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'When to use async messaging vs synchronous calls?', difficulty: 'medium' },
              { id: g(), title: 'Kafka architecture: topics, partitions, consumers', difficulty: 'hard' },
              { id: g(), title: 'At-least-once vs exactly-once delivery guarantees', difficulty: 'hard' },
              { id: g(), title: 'How to handle dead letter queues and retries', difficulty: 'medium' },
            ]
          },
          {
            id: 'sd-t4-s3', name: 'Rate Limiting & API Gateway', description: 'Token bucket, leaky bucket, sliding window',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Design a rate limiter (token bucket algorithm)', difficulty: 'medium' },
              { id: g(), title: 'Distributed rate limiting across multiple servers', difficulty: 'hard' },
              { id: g(), title: 'API Gateway responsibilities and design', difficulty: 'medium' },
            ]
          },
        ]
      },
      {
        id: 'sd-t5', name: 'Week 5 — HLD: URL Shortener & Pastebin', week: 5,
        description: 'First HLD problems: simple but covers encoding, storage, and caching patterns.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'sd-t5-s1', name: 'Design URL Shortener (bit.ly)', description: 'Hashing, redirection, analytics',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Estimate scale: 100M URLs/day — storage requirements', difficulty: 'easy' },
              { id: g(), title: 'Base62 encoding for short URL generation', difficulty: 'medium' },
              { id: g(), title: 'Handle hash collisions in URL generation', difficulty: 'medium' },
              { id: g(), title: 'Add analytics: click tracking, geo data', difficulty: 'hard' },
              { id: g(), title: 'Caching strategy for hot URLs', difficulty: 'medium' },
            ]
          },
          {
            id: 'sd-t5-s2', name: 'Design Pastebin', description: 'Object storage, expiry, access control',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Design data model for Pastebin', difficulty: 'easy' },
              { id: g(), title: 'Where to store paste content: DB vs object storage?', difficulty: 'medium' },
              { id: g(), title: 'Implement paste expiry with scheduled cleanup', difficulty: 'medium' },
            ]
          },
        ]
      },
      {
        id: 'sd-t6', name: 'Week 6 — HLD: Social Media Systems', week: 6,
        description: 'Design Twitter, Instagram, and news feed — fan-out, timeline generation, media storage.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'sd-t6-s1', name: 'Design Twitter / X', description: 'Tweets, following, timeline, trending',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Data model: Users, Tweets, Followers', difficulty: 'medium' },
              { id: g(), title: 'Fan-out on write vs fan-out on read for timeline', difficulty: 'hard' },
              { id: g(), title: 'How does Twitter handle celebrities with 10M+ followers?', difficulty: 'hard' },
              { id: g(), title: 'Design trending hashtags with sliding window', difficulty: 'hard' },
              { id: g(), title: 'Search tweets — Elasticsearch integration', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t6-s2', name: 'Design Instagram', description: 'Photo upload, feed, stories, CDN',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Photo upload flow with CDN and object storage', difficulty: 'medium' },
              { id: g(), title: 'Generate user feed with ranked content', difficulty: 'hard' },
              { id: g(), title: 'Design Instagram Stories with 24h expiry', difficulty: 'hard' },
              { id: g(), title: 'Notification system for likes and comments', difficulty: 'medium' },
            ]
          },
        ]
      },
      {
        id: 'sd-t7', name: 'Week 7 — HLD: Streaming & Ride Sharing', week: 7,
        description: 'Design Netflix (video streaming) and Uber (real-time geo matching).',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'sd-t7-s1', name: 'Design Netflix', description: 'Video streaming, encoding, recommendations',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Video upload and transcoding pipeline', difficulty: 'hard' },
              { id: g(), title: 'Adaptive bitrate streaming (ABR) with HLS/DASH', difficulty: 'hard' },
              { id: g(), title: 'Content delivery with geographically distributed CDN', difficulty: 'medium' },
              { id: g(), title: 'Recommendation engine — collaborative filtering basics', difficulty: 'hard' },
              { id: g(), title: 'Handling peak load (10M concurrent streams)', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t7-s2', name: 'Design Uber / Lyft', description: 'Real-time matching, GPS tracking, surge pricing',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Real-time driver location tracking at scale', difficulty: 'hard' },
              { id: g(), title: 'Matching algorithm: nearest driver with geohashing', difficulty: 'hard' },
              { id: g(), title: 'Surge pricing calculation and dynamic rates', difficulty: 'hard' },
              { id: g(), title: 'Trip state machine and payment processing', difficulty: 'medium' },
              { id: g(), title: 'ETA calculation and route optimization', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t7-s3', name: 'Design WhatsApp / Chat System', description: 'Real-time messaging, presence, delivery',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'WebSocket-based real-time message delivery', difficulty: 'medium' },
              { id: g(), title: 'Message delivery status: sent, delivered, read', difficulty: 'medium' },
              { id: g(), title: 'Group chats at scale — fan-out challenges', difficulty: 'hard' },
              { id: g(), title: 'End-to-end encryption design', difficulty: 'hard' },
            ]
          },
        ]
      },
      {
        id: 'sd-t8', name: 'Week 8 — Microservices & Advanced Patterns', week: 8,
        description: 'Service mesh, event-driven architecture, distributed tracing, and resilience patterns.',
        status: 'not-started', notes: '', expanded: false,
        subtopics: [
          {
            id: 'sd-t8-s1', name: 'Microservices Architecture', description: 'Service decomposition, inter-service communication',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'When to use microservices vs monolith?', difficulty: 'medium' },
              { id: g(), title: 'Service discovery: Consul vs Kubernetes DNS', difficulty: 'medium' },
              { id: g(), title: 'Saga pattern for distributed transactions', difficulty: 'hard' },
              { id: g(), title: 'CQRS pattern — separating reads and writes', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t8-s2', name: 'Resilience & Fault Tolerance', description: 'Circuit breaker, bulkhead, retry patterns',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Circuit breaker pattern — implementation and states', difficulty: 'medium' },
              { id: g(), title: 'Exponential backoff with jitter for retries', difficulty: 'medium' },
              { id: g(), title: 'Bulkhead pattern — isolating failures', difficulty: 'medium' },
              { id: g(), title: 'Chaos engineering — Netflix Chaos Monkey', difficulty: 'hard' },
            ]
          },
          {
            id: 'sd-t8-s3', name: 'Observability', description: 'Logging, metrics, distributed tracing',
            status: 'not-started', notes: '', expanded: false,
            problems: [
              { id: g(), title: 'Structured logging with correlation IDs', difficulty: 'easy' },
              { id: g(), title: 'Distributed tracing with OpenTelemetry/Jaeger', difficulty: 'medium' },
              { id: g(), title: 'SLOs, SLAs, and error budgets', difficulty: 'medium' },
              { id: g(), title: 'Alerting strategy — avoiding alert fatigue', difficulty: 'medium' },
            ]
          },
        ]
      },
    ]
  },
]
