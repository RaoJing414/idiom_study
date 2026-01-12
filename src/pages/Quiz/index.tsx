import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { idioms } from "../../data/idioms";
import type { Idiom } from "../../types";
import { progressApi } from "../../api/progress";

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: "idiom" | "definition" }>();
  const [searchParams] = useSearchParams();
  const freq = searchParams.get("freq") || "all";
  const day = parseInt(searchParams.get("day") || "1");
  const source = searchParams.get("source");

  // 当前题目的索引
  const [currentIndex, setCurrentIndex] = useState(0);
  // 是否显示答案反馈（正确/错误颜色）
  const [showAnswer, setShowAnswer] = useState(false);
  // 用户当前选择的选项索引
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  // 存储生成的题目列表，每个题目包含成语本体和4个选项
  const [quizQuestions, setQuizQuestions] = useState<
    { idiom: Idiom; options: (string | Idiom)[] }[]
  >([]);
  // 存储所有题目的答题结果，用于顶部进度条显示和历史记录
  const [quizResults, setQuizResults] = useState<
    { isCorrect: boolean | null; selectedIdx: number | null }[]
  >([]);
  // 标记是否已从 IndexedDB 加载过历史记录
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const [sourceIdioms, setSourceIdioms] = useState<Idiom[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 加载成语数据：根据 URL 参数（频率、天数、错题本）筛选出需要学习的成语
  useEffect(() => {
    const loadIdioms = async () => {
      setLoading(true);
      if (source === "wrong") {
        // 如果是从“错题本”进入，只加载上次答错的成语
        const allProgress = await progressApi.getAll();
        const wrongIds = allProgress
          .filter((p) => p.lastQuizResult === false)
          .map((p) => p.idiomId);

        const filtered = idioms.filter((i) => wrongIds.includes(i.id));
        setSourceIdioms(filtered);
      } else {
        // 常规学习模式：根据频率筛选（高频/常见/一般）并按天分页（每天30个）
        let result = idioms;
        if (freq !== "all") {
          result = result.filter((i) => {
            if (freq === "high") return i.frequency >= 12;
            if (freq === "mid") return i.frequency >= 6 && i.frequency < 12;
            if (freq === "low") return (i.frequency || 0) < 6;
            return true;
          });
        }
        const start = (day - 1) * 30;
        setSourceIdioms(result.slice(start, start + 30));
      }
      setLoading(false);
    };

    loadIdioms();
  }, [freq, day, source]);

  const filteredIdioms = sourceIdioms;

  // Generate all questions once
  // 2. 生成题目：为每个成语准备好选项（包含1个正确答案和3个干扰项）
  useEffect(() => {
    if (filteredIdioms.length > 0) {
      const generated = filteredIdioms.map((idiom) => {
        if (mode === "idiom" && idiom.options && idiom.options.length > 0) {
          // 模式A：看着成语选释义
          // 优先使用 JSON 数据中预生成的易错释义选项（如果存在）
          const options = idiom.options;
          return { idiom, options };
        } else {
          // 模式B：看着释义选成语 (或回退逻辑)
          // 随机从其他成语中选取3个作为干扰项
          const others = idioms.filter((i) => i.id !== idiom.id);
          const distractors = others
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          // 将正确成语和干扰项混合打乱
          const options = [...distractors, idiom].sort(
            () => 0.5 - Math.random()
          );
          return { idiom, options };
        }
      });
      setQuizQuestions(generated);
    }
  }, [filteredIdioms, mode]);

  // Load history
  // 3. 恢复历史记录：从数据库中读取之前的答题结果，以便用户继续从未完成的地方开始
  useEffect(() => {
    if (filteredIdioms.length > 0) {
      const ids = filteredIdioms.map((i) => i.id);
      progressApi.getBatch(ids).then((batch) => {
        const results = filteredIdioms.map((i) => ({
          isCorrect: batch[i.id]?.lastQuizResult ?? null,
          selectedIdx: batch[i.id]?.lastSelectedOptionIdx ?? null,
        }));
        setQuizResults(results);
        setHistoryLoaded(true);
      });
    }
  }, [filteredIdioms]);

  const currentQuestion = quizQuestions[currentIndex];

  // Sync current question state with history
  // 4. 同步 UI 状态：当题目切换时，根据历史记录显示之前的选择（如果有）
  useEffect(() => {
    if (historyLoaded && currentQuestion) {
      const result = quizResults[currentIndex];
      if (result.isCorrect !== null) {
        // 如果这道题做过了，显示答案和之前的选择
        setShowAnswer(true);
        setSelectedOption(result.selectedIdx);
      } else {
        // 如果是新题，重置状态
        setShowAnswer(false);
        setSelectedOption(null);
      }
    }
  }, [currentIndex, historyLoaded, quizQuestions, quizResults]);

  if (loading || filteredIdioms.length === 0 || quizQuestions.length === 0) {
    return (
      <div
        className="glass-card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          textAlign: "center",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>
          {loading ? "正在加载题目..." : "暂无错题，继续保持哦！"}
        </p>
        {!loading && filteredIdioms.length === 0 && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
            style={{ marginTop: "1rem" }}
          >
            返回首页
          </button>
        )}
      </div>
    );
  }

  // 处理用户点击选项逻辑
  const handleOptionSelect = async (idx: number) => {
    // 如果已经显示了答案（已作答），则通过防止重复点击
    if (showAnswer) return;

    let isCorrect = false;
    const selectedOpt = currentQuestion.options[idx];

    // 判断正误：根据选项类型是字符串（释义）还是对象（成语）来比对
    if (typeof selectedOpt === "string") {
      isCorrect = selectedOpt === currentQuestion.idiom.definition;
    } else {
      isCorrect = (selectedOpt as Idiom).id === currentQuestion.idiom.id;
    }

    // 1. 立即更新本地 UI 状态，给用户即时反馈
    const newResults = [...quizResults];
    newResults[currentIndex] = { isCorrect, selectedIdx: idx };
    setQuizResults(newResults);
    setSelectedOption(idx);
    setShowAnswer(true);

    // 2. 异步保存结果到数据库，用于长期记录和错题本功能
    await progressApi.recordQuizResult(
      currentQuestion.idiom.id,
      isCorrect,
      idx
    );
  };

  const next = () => {
    if (currentIndex < filteredIdioms.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>
            {currentIndex + 1} / {filteredIdioms.length}
          </span>
          <span
            className="glass-card"
            style={{
              padding: "0.2rem 0.8rem",
              borderRadius: "50px",
              fontSize: "0.8rem",
            }}
          >
            {mode === "idiom" ? "看着成语选释义" : "看着释义选成语"}
          </span>
        </div>

        {/* Progress Dots Indicator */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            background: "rgba(255,255,255,0.03)",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          {quizResults.map((res, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                cursor: "pointer",
                background:
                  i === currentIndex
                    ? "var(--primary)"
                    : res.isCorrect === true
                    ? "#10b981"
                    : res.isCorrect === false
                    ? "#ef4444"
                    : "rgba(255,255,255,0.1)",
                border: i === currentIndex ? "2px solid white" : "none",
                boxShadow:
                  i === currentIndex ? "0 0 8px var(--primary)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          minHeight: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        {mode === "idiom" ? (
          <h2
            style={{ fontSize: "2.5rem", margin: 0, color: "var(--primary)" }}
          >
            {currentQuestion.idiom.word}
          </h2>
        ) : (
          <p style={{ fontSize: "1.2rem", lineHeight: "1.6", margin: 0 }}>
            {currentQuestion.idiom.definition}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {currentQuestion.options.map((opt, idx) => {
          const isCorrect =
            typeof opt === "string"
              ? opt === currentQuestion.idiom.definition
              : (opt as Idiom).id === currentQuestion.idiom.id;
          const isSelected = selectedOption === idx;

          let btnStyle: React.CSSProperties = {
            justifyContent: "flex-start",
            textAlign: "left",
            padding: "1.2rem",
            transition: "all 0.3s ease",
            height: "auto",
            minHeight: "4rem",
          };

          if (showAnswer) {
            if (isCorrect) {
              btnStyle.backgroundColor = "rgba(16, 185, 129, 0.2)";
              btnStyle.borderColor = "#10b981";
            } else if (isSelected) {
              btnStyle.backgroundColor = "rgba(239, 68, 68, 0.2)";
              btnStyle.borderColor = "#ef4444";
            } else {
              btnStyle.opacity = 0.5;
            }
          } else if (isSelected) {
            btnStyle.borderColor = "var(--primary)";
            btnStyle.backgroundColor = "rgba(var(--primary-rgb), 0.1)";
          }

          return (
            <button
              key={`${currentIndex}-${idx}`}
              className="btn btn-outline"
              onClick={() => handleOptionSelect(idx)}
              style={btnStyle}
            >
              <span
                style={{
                  marginRight: "0.8rem",
                  opacity: 0.5,
                  fontWeight: "bold",
                }}
              >
                {String.fromCharCode(65 + idx)}.
              </span>
              <span style={{ flex: 1 }}>
                {typeof opt === "string" ? opt : opt.word}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          className="btn btn-outline"
          onClick={prev}
          disabled={currentIndex === 0}
          style={{ flex: 1, height: "3.5rem" }}
        >
          <ChevronLeft size={18} /> 上一个
        </button>
        {showAnswer && (
          <button
            className="btn btn-outline"
            onClick={() => setShowAnswer(!showAnswer)}
            style={{ flex: 0.5, height: "3.5rem" }}
          >
            {showAnswer ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={next}
          disabled={currentIndex === filteredIdioms.length - 1}
          style={{ flex: 1, height: "3.5rem" }}
        >
          下一个 <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Quiz;
