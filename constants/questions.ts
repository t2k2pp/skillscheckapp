
import { QuizQuestion, QuestionLevel } from '../types';

export const QUESTIONS: QuizQuestion[] = [
  // 基礎レベル (1-16)
  {
    id: 1,
    level: QuestionLevel.Beginner,
    text: '`std::vector` の末尾に要素を追加するためのメンバ関数はどれですか？',
    options: ['add_element', 'push_front', 'append', 'push_back'],
    correctAnswerIndex: 3,
    explanation: '`std::vector` の末尾に要素を追加するには `push_back()` を使用します。これにより、コンテナのサイズが動的に拡張されます。',
  },
  {
    id: 2,
    level: QuestionLevel.Beginner,
    text: 'C++において、オブジェクトの初期化時に呼び出される特殊なメンバ関数は何ですか？',
    options: ['デストラクタ', 'コンストラクタ', 'イニシャライザ', 'セッター'],
    correctAnswerIndex: 1,
    explanation: 'コンストラクタは、クラスのオブジェクトが作成される際に自動的に呼び出され、メンバ変数の初期化などを行います。',
  },
  {
    id: 3,
    level: QuestionLevel.Beginner,
    text: '例外が発生する可能性のあるコードブロックを囲むために使用されるキーワードはどれですか？',
    options: ['catch', 'throw', 'try', 'finally'],
    correctAnswerIndex: 2,
    explanation: '`try` ブロックは例外が発生する可能性のあるコードを囲みます。`catch` ブロックは発生した例外を捕捉して処理します。',
  },
  {
    id: 4,
    level: QuestionLevel.Beginner,
    text: 'キーと値のペアを格納し、キーに基づいて高速な検索を可能にするSTLコンテナはどれですか？',
    options: ['std::vector', 'std::list', 'std::map', 'std::set'],
    correctAnswerIndex: 2,
    explanation: '`std::map`は、キーと値のペアを関連付けて格納する連想コンテナです。内部的には通常、赤黒木で実装されており、キーによる高速な検索、挿入、削除が可能です。'
  },
  {
    id: 13,
    level: QuestionLevel.Beginner,
    text: 'ポインタと参照の主な違いは何ですか？',
    options: ['参照は再代入可能だが、ポインタは不可能', 'ポインタはNULLを持つことができるが、参照は通常できない', 'ポインタはアドレスを格納しない', '参照は常にヒープメモリを指す'],
    correctAnswerIndex: 1,
    explanation: 'ポインタはNULLを指すことができ、指すアドレスを後から変更できます。一方、参照は一度初期化されると、別のエンティティを指すように変更することはできず、NULLになることもありません。',
  },
  {
    id: 14,
    level: QuestionLevel.Beginner,
    text: '`std::string`オブジェクト `s1` と `s2` を連結する正しい方法はどれですか？',
    options: ['s1.concat(s2)', 's1.append(s2)', 's1 + s2', 'BとCの両方'],
    correctAnswerIndex: 3,
    explanation: '`std::string`は `+` 演算子による連結と `append()` メンバ関数の両方をサポートしています。どちらも文字列を連結するために使用できます。',
  },
  {
    id: 15,
    level: QuestionLevel.Beginner,
    text: 'クラスのメンバに対する `private` アクセス指定子の意味は何ですか？',
    options: ['そのクラスのオブジェクトからのみアクセス可能', 'そのクラスのメンバ関数からのみアクセス可能', '派生クラスからのみアクセス可能', 'どこからでもアクセス可能'],
    correctAnswerIndex: 1,
    explanation: '`private` メンバは、そのクラス自身のメンバ関数（およびフレンド）からのみアクセスできます。外部や派生クラスからの直接アクセスは許可されません。',
  },
  {
    id: 16,
    level: QuestionLevel.Beginner,
    text: '`std::set` コンテナの最も重要な特性は何ですか？',
    options: ['要素を挿入順に保持する', '重複したキーを許可する', '全ての要素がユニークであり、ソートされている', 'キーと値のペアを格納する'],
    correctAnswerIndex: 2,
    explanation: '`std::set` はユニークな要素を格納する連想コンテナであり、要素は自動的にソートされた順序で保持されます。重複した要素を格納することはできません。',
  },
  {
    id: 25,
    level: QuestionLevel.Beginner,
    text: 'C++11で導入された、nullポインタを表すためのキーワードはどれですか？',
    options: ['NULL', '0', 'nullptr', 'void*'],
    correctAnswerIndex: 2,
    explanation: '`nullptr` は型安全なnullポインタ定数です。`NULL` や `0` と異なり、整数型と曖昧に解釈されることがないため、オーバーロード解決などで問題を起こしにくくなります。'
  },
  {
    id: 26,
    level: QuestionLevel.Beginner,
    text: '`struct` と `class` の主な違いは何ですか？',
    options: ['`struct` はメンバ関数を持てない', '`class` のデフォルトのアクセス指定子は `private`、`struct` は `public`', '`struct` は継承できない', '`class` はテンプレートにできない'],
    correctAnswerIndex: 1,
    explanation: '`struct` と `class` の機能的な違いはほとんどありませんが、デフォルトのアクセス指定子が異なります。`class` は `private`、`struct` は `public` です。慣習的に、単純なデータ集合には `struct` が使われます。'
  },
  {
    id: 27,
    level: QuestionLevel.Beginner,
    text: 'コンテナの全ての要素に対して繰り返し処理を行う、C++11で導入された構文はどれですか？',
    options: ['`for_each(v.begin(), v.end(), ...)`', '`for (int i=0; i<v.size(); ++i)`', '範囲ベース for ループ (`for (auto& item : v)`)', '`while` ループ'],
    correctAnswerIndex: 2,
    explanation: '範囲ベース for ループは、コンテナの各要素に対して簡潔に繰り返し処理を記述するための構文です。コードが読みやすくなり、イテレータを直接操作する際のミスを防ぎます。'
  },
  {
    id: 28,
    level: QuestionLevel.Beginner,
    text: '`new` で確保したメモリを解放するために使用する演算子はどれですか？',
    options: ['`free`', '`release`', '`delete`', '`destroy`'],
    correctAnswerIndex: 2,
    explanation: '`new` で確保した単一オブジェクトは `delete` で、`new[]` で確保した配列は `delete[]` で解放する必要があります。メモリリークを防ぐための基本です。'
  },
  {
    id: 29,
    level: QuestionLevel.Beginner,
    text: 'ヘッダーファイルでインクルードガード（`#ifndef`, `#define`, `#endif`）を使用する主な理由は何ですか？',
    options: ['コンパイル時間を短縮するため', '特定のOSでのみコードをコンパイルするため', '同じヘッダーファイルが複数回インクルードされるのを防ぐため', 'デバッグ情報を追加するため'],
    correctAnswerIndex: 2,
    explanation: 'インクルードガードは、同じヘッダーファイルが1つの翻訳単位内で複数回インクルードされ、クラスや関数の多重定義エラーが発生するのを防ぐために使用されます。'
  },
  {
    id: 30,
    level: QuestionLevel.Beginner,
    text: '関数の引数で `const std::string& name` のように `const` と参照 `&` を使う利点は何ですか？',
    options: ['関数内で引数を変更できる', '文字列のコピーを避け、かつ関数内で値を変更しないことを保証する', '常にスタックメモリを使用するようになる', '引数がnullでないことを保証する'],
    correctAnswerIndex: 1,
    explanation: '参照 `&` を使うことで、`std::string` のような大きなオブジェクトの不要なコピーを防ぎ、パフォーマンスを向上させます。`const` を付けることで、関数内でその引数が変更されないことをコンパイラに伝え、安全性を高めます。'
  },
  {
    id: 31,
    level: QuestionLevel.Beginner,
    text: '`std::vector` の現在の要素数を得る関数と、確保されているメモリ容量を得る関数の組み合わせはどれですか？',
    options: ['`count()` と `storage()`', '`length()` と `memory()`', '`size()` と `capacity()`', '`elements()` と `allocated()`'],
    correctAnswerIndex: 2,
    explanation: '`size()` はベクタに実際に格納されている要素の数を返します。`capacity()` は、再確保（リロケーション）なしでベクタが保持できる要素の数を返します。`capacity()` >= `size()` は常に真です。'
  },
  {
    id: 32,
    level: QuestionLevel.Beginner,
    text: 'オブジェクトの生存期間が終了するときに自動的に呼び出される特殊なメンバ関数は何ですか？',
    options: ['ファイナライザ', 'コンストラクタ', 'クローザー', 'デストラクタ'],
    correctAnswerIndex: 3,
    explanation: 'デストラクタは、オブジェクトがスコープを抜ける、`delete` されるなどのタイミングで呼び出され、オブジェクトが確保したリソース（メモリ、ファイルハンドルなど）を解放する役割を担います。'
  },

  // 中級レベル (17-34)
  {
    id: 5,
    level: QuestionLevel.Intermediate,
    text: 'RAII (Resource Acquisition Is Initialization) 原則を最も体現しているC++の機能はどれですか？',
    options: ['スマートポインタ', '仮想関数', 'ラムダ式', 'テンプレート'],
    correctAnswerIndex: 0,
    explanation: 'スマートポインタ（`std::unique_ptr`, `std::shared_ptr`）は、オブジェクトの生存期間を管理し、スコープを抜ける際に自動的にリソースを解放するため、RAIIの最も代表的な例です。',
  },
  {
    id: 6,
    level: QuestionLevel.Intermediate,
    text: '任意の型に対して動作する関数を定義するために使用されるC++の機能は何ですか？',
    options: ['ポリモーフィズム', '関数オーバーロード', '関数テンプレート', '仮想関数'],
    correctAnswerIndex: 2,
    explanation: '関数テンプレートを使用すると、具体的な型をパラメータ化して、様々な型に対して同じ操作を行う汎用的な関数を定義できます。',
  },
  {
    id: 7,
    level: QuestionLevel.Intermediate,
    text: '`std::sort` を使用して `std::vector<int>` を降順にソートするための正しい方法はどれですか？',
    options: [
      'std::sort(vec.begin(), vec.end(), std::greater<int>());',
      'std::sort(vec.begin(), vec.end(), "desc");',
      'std::sort(vec.rbegin(), vec.rend());',
      'AとCの両方',
    ],
    correctAnswerIndex: 3,
    explanation: '`std::sort` に比較関数オブジェクト `std::greater<int>()` を渡す方法と、リバースイテレータ `rbegin()` と `rend()` を使用する方法のどちらでも降順ソートが可能です。',
  },
  {
    id: 8,
    level: QuestionLevel.Intermediate,
    text: 'ファイルからの読み込みとファイルへの書き込みの両方を行うために使用される `fstream` のクラスはどれですか？',
    options: ['std::ifstream', 'std::ofstream', 'std::fstream', 'std::stringstream'],
    correctAnswerIndex: 2,
    explanation: '`std::ifstream` はファイル入力、`std::ofstream` はファイル出力に特化しています。`std::fstream` は入力と出力の両方の操作をサポートします。'
  },
  {
    id: 17,
    level: QuestionLevel.Intermediate,
    text: '`std::vector<int> v` 内で特定の値 `x` を探すために推奨されるSTLアルゴリズムはどれですか？',
    options: ['std::search', 'std::find', 'std::lookup', 'std::query'],
    correctAnswerIndex: 1,
    explanation: '`std::find` は、指定された範囲内で特定の値を持つ最初の要素を検索し、その要素を指すイテレータを返します。見つからない場合は、範囲の終端イテレータを返します。',
  },
  {
    id: 18,
    level: QuestionLevel.Intermediate,
    text: '`std::unique_ptr` と `std::shared_ptr` の最も大きな違いは何ですか？',
    options: ['`unique_ptr` はスタックにしか割り当てられない', '`shared_ptr` は所有権を共有できるが、`unique_ptr` は排他的な所有権を持つ', '`unique_ptr` はより多くのメモリを消費する', '`shared_ptr` は配列を管理できない'],
    correctAnswerIndex: 1,
    explanation: '`unique_ptr` はリソースの排他的な所有権を保証し、コピーできません（ムーブは可能）。一方、`shared_ptr` は参照カウントを使用して、複数のポインタが同じリソースの所有権を共有できるようにします。',
  },
  {
    id: 19,
    level: QuestionLevel.Intermediate,
    text: '`template <typename T> class Box { ... };` のように定義されたクラステンプレートを、`int` 型でインスタンス化する正しい構文はどれですか？',
    options: ['Box<int> b;', 'Box b<int>;', 'int Box b;', 'Box(int) b;'],
    correctAnswerIndex: 0,
    explanation: 'クラステンプレートを特定の型でインスタンス化するには、クラス名の後に山括弧 `<>` を使用して型引数を指定します。例: `Box<int> myIntBox;`',
  },
  {
    id: 20,
    level: QuestionLevel.Intermediate,
    text: 'クラスのメンバ関数が `const` として宣言されている場合、それは何を意味しますか？',
    options: ['その関数は静的メンバである', 'その関数は値を返すことができない', 'その関数はクラスの非静的メンバ変数を変更しない', 'その関数は仮想関数である'],
    correctAnswerIndex: 2,
    explanation: '`const` メンバ関数は、その関数内でオブジェクトのメンバ変数を変更しないことをコンパイラに約束します。これにより、`const` オブジェクトに対してこの関数を呼び出すことが可能になります。',
  },
  {
    id: 33,
    level: QuestionLevel.Intermediate,
    text: '基底クラスのポインタや参照を通じて派生クラスのオブジェクトを安全に削除するために必要なものは何ですか？',
    options: ['純粋仮想関数', '仮想コンストラクタ', '`protected` なデストラクタ', '仮想デストラクタ'],
    correctAnswerIndex: 3,
    explanation: '基底クラスのデストラクタが `virtual` でないと、基底クラスのポインタを通じて派生クラスのオブジェクトを `delete` した際に派生クラスのデストラクタが呼ばれず、リソースリークの原因となります。'
  },
  {
    id: 34,
    level: QuestionLevel.Intermediate,
    text: '`std::move` の主な目的は何ですか？',
    options: ['オブジェクトを別のメモリ位置に移動させる', 'オブジェクトを右辺値にキャストする', 'オブジェクトのコピーを作成する', 'オブジェクトの所有権を放棄する'],
    correctAnswerIndex: 1,
    explanation: '`std::move` は実際には何も移動させません。左辺値を右辺値参照にキャストするだけです。これにより、ムーブコンストラクタやムーブ代入演算子がオーバーロード解決で選択され、効率的なリソースの移動が可能になります。'
  },
  {
    id: 35,
    level: QuestionLevel.Intermediate,
    text: 'ラムダ式 `[=](){ ... }` の `[=]` は何を意味しますか？',
    options: ['外部の変数を参照でキャプチャする', '外部の変数を値でキャプチャする', 'キャプチャを行わない', '`this` ポインタのみをキャプチャする'],
    correctAnswerIndex: 1,
    explanation: '`[=]` はデフォルトキャプチャモードで、ラムダ式が定義されたスコープ内の全ての自動変数を値で（コピーして）キャプチャすることを示します。'
  },
  {
    id: 36,
    level: QuestionLevel.Intermediate,
    text: 'クラスの特定のインスタンスに属さず、クラス全体で共有されるメンバ変数やメンバ関数を宣言するキーワードはどれですか？',
    options: ['`global`', '`shared`', '`static`', '`common`'],
    correctAnswerIndex: 2,
    explanation: '`static` メンバ変数はクラスの全てのインスタンスで共有されます。`static` メンバ関数は特定のインスタンスを必要とせず、クラス名を使って直接呼び出すことができます。'
  },
  {
    id: 37,
    level: QuestionLevel.Intermediate,
    text: '`std::vector` の全要素を2倍にする処理を `std::transform` で記述する際の正しいラムダ式はどれですか？',
    options: ['`(int x){ x * 2; }`', '`(int x) -> { return x * 2; }`', '`(int x){ return x * 2; }`', '`[](int& x){ x = x * 2; }`'],
    correctAnswerIndex: 2,
    explanation: '`std::transform` は、入力範囲の各要素に関数を適用し、その結果を出力範囲に書き込みます。この場合、各要素 `x` を受け取り、`x * 2` を返すラムダ式が適切です。'
  },
  {
    id: 38,
    level: QuestionLevel.Intermediate,
    text: 'コンストラクタに `explicit` キーワードを付ける主な理由は何ですか？',
    options: ['コンストラクタのインライン化を防ぐため', '暗黙的な型変換を防ぐため', '仮想関数テーブルから除外するため', 'コピーコンストラクタの自動生成を抑制するため'],
    correctAnswerIndex: 1,
    explanation: '`explicit` は、引数が1つのコンストラクタが意図しない暗黙の型変換に使われるのを防ぎます。例えば `MyClass obj = 10;` のようなコードがコンパイルエラーになります。'
  },
  {
    id: 39,
    level: QuestionLevel.Intermediate,
    text: 'C++17で導入された `std::optional` はどのような状況で使用するのが最も適切ですか？',
    options: ['値が存在しない可能性がある場合', '複数の型のうちのいずれかの値を保持する場合', '動的に確保されたオブジェクトを管理する場合', '文字列を効率的に操作する場合'],
    correctAnswerIndex: 0,
    explanation: '`std::optional<T>` は、`T` 型の値を持つか、値を持たない（空である）状態を表現するための型です。マジックナンバー（-1など）やnullポインタを使わずに、値の有無を安全に表現できます。'
  },
  {
    id: 40,
    level: QuestionLevel.Intermediate,
    text: '関数から複数の値を返すための、C++17で推奨される現代的な方法の一つはどれですか？',
    options: ['ポインタ引数を使用する', '`std::pair` や `std::tuple` を使用する', '構造体を定義して返す', 'BとCの両方（構造化束縛と組み合わせる）'],
    correctAnswerIndex: 3,
    explanation: '`std::pair`、`std::tuple`、あるいは専用の構造体を返すのが一般的な方法です。C++17の構造化束縛 (`auto [a, b] = func();`) を使うことで、これらの戻り値を非常に簡潔に受け取ることができます。'
  },
  {
    id: 49,
    level: QuestionLevel.Intermediate,
    text: 'C++17で導入された `std::variant` の主な用途は何ですか？',
    options: ['値が存在しない可能性を表現する', '複数の型のうち、いずれか一つの値をその時点でもつことを型安全に表現する', '任意の型の値を保持するが、型情報は実行時に確認する', 'キーと値のペアを格納する'],
    correctAnswerIndex: 1,
    explanation: '`std::variant<T, U, ...>` は、列挙された型のうち、いずれか一つの値を保持できる和集合型です。`union`と異なり型安全であり、`std::visit` を使って保持している値の型に応じた処理を記述できます。'
  },

  // 上級レベル (35-50)
  {
    id: 9,
    level: QuestionLevel.Advanced,
    text: 'オブジェクトの生成プロセスをカプセル化し、クライアントコードから具象クラスを分離するデザインパターンはどれですか？',
    options: ['Observer パターン', 'Singleton パターン', 'Factory パターン', 'Strategy パターン'],
    correctAnswerIndex: 2,
    explanation: 'Factory パターンは、オブジェクト生成のロジックを専用のファクトリクラスやメソッドに委譲することで、クライアントが具象クラスに直接依存することなくオブジェクトを生成できるようにするデザインパターンです。',
  },
  {
    id: 10,
    level: QuestionLevel.Advanced,
    text: '複数のスレッドから共有リソースへの同時アクセスを防ぎ、競合状態を回避するために使用される同期プリミティブはどれですか？',
    options: ['std::thread', 'std::async', 'std::mutex', 'std::future'],
    correctAnswerIndex: 2,
    explanation: '`std::mutex`（ミューテックス）は、クリティカルセクションへのアクセスを一度に一つのスレッドに制限するためのロック機構を提供します。',
  },
  {
    id: 11,
    level: QuestionLevel.Advanced,
    text: '右辺値参照 (`&&`) を活用して、不要なオブジェクトのコピーを避け、リソースの所有権を効率的に移動させるC++の機能は何ですか？',
    options: ['完全転送 (Perfect Forwarding)', 'ムーブセマンティクス (Move Semantics)', 'コピーコンストラクタ', '参照渡し'],
    correctAnswerIndex: 1,
    explanation: 'ムーブセマンティクスは、一時オブジェクトなどの右辺値からリソース（メモリなど）を「盗む」ことで、高コストなコピー処理を回避し、パフォーマンスを向上させる仕組みです。`std::move`がこのために使われます。',
  },
  {
    id: 12,
    level: QuestionLevel.Advanced,
    text: 'C++20で導入され、テンプレートパラメータに対する制約を簡潔に記述できるようにする機能はどれですか？',
    options: ['SFINAE', 'Concepts', 'Modules', 'Coroutines'],
    correctAnswerIndex: 1,
    explanation: 'Concepts（コンセプト）は、テンプレートの型パラメータが満たすべき要件（特定のメンバ関数を持つ、特定の演算が可能など）を定義する機能です。これにより、コンパイルエラーが分かりやすくなり、コードの可読性が向上します。',
  },
  {
    id: 21,
    level: QuestionLevel.Advanced,
    text: '`std::thread` を使用して新しいスレッドを開始する際の一般的な方法はどれですか？',
    options: ['`std::thread t; t.start(my_function);`', '`std::thread t(my_function);`', '`std::thread::create(my_function);`', '`new std::thread(my_function);`'],
    correctAnswerIndex: 1,
    explanation: '`std::thread` のコンストラクタに、新しいスレッドで実行したい関数（または呼び出し可能なオブジェクト）を渡すことでスレッドが生成され、実行が開始されます。',
  },
  {
    id: 22,
    level: QuestionLevel.Advanced,
    text: 'Observer パターンの主な目的は何ですか？',
    options: ['オブジェクトの生成ロジックをカプセル化する', 'アルゴリズムのファミリーを定義し、交換可能にする', 'オブジェクトの状態が変化したときに、依存する全てのオブジェクトに自動的に通知して更新する', 'あるクラスのインターフェースを、クライアントが期待する別のインターフェースに変換する'],
    correctAnswerIndex: 2,
    explanation: 'Observer パターンは、1対多の依存関係を定義します。あるオブジェクト（Subject）の状態が変化すると、それに依存する全てのオブジェクト（Observer）が通知を受け、自動的に更新されます。',
  },
  {
    id: 23,
    level: QuestionLevel.Advanced,
    text: 'SFINAE ("Substitution Failure Is Not An Error") は、主にどのような目的で使用されますか？',
    options: ['実行時エラーを処理するため', 'テンプレートのオーバーロード解決中に、特定の条件を満たさないテンプレートを候補から除外するため', 'コードの実行速度を最適化するため', 'メモリリークを検出するため'],
    correctAnswerIndex: 1,
    explanation: 'SFINAEは、テンプレートのインスタンス化プロセスにおけるコンパイル時のメカニズムです。置換が失敗した場合、それはコンパイルエラーではなく、単にそのオーバーロード候補が適用できないと見なされるだけです。これにより、特定の型特性に基づいてテンプレートの特殊化を制御できます。',
  },
  {
    id: 24,
    level: QuestionLevel.Advanced,
    text: 'コンパイラが特定の状況でオブジェクトのコピーやムーブを省略する最適化を何と呼びますか？',
    options: ['インライン展開 (Inlining)', 'ループ展開 (Loop Unrolling)', 'コピー省略 (Copy Elision)', '遅延評価 (Lazy Evaluation)'],
    correctAnswerIndex: 2,
    explanation: 'コピー省略（特に名前付き戻り値の最適化、NRVO）は、関数からオブジェクトを返す際に、余分なコピーやムーブのコンストラクタ呼び出しをコンパイラが省略する最適化です。これにより、パフォーマンスが大幅に向上することがあります。',
  },
  {
    id: 41,
    level: QuestionLevel.Advanced,
    text: '`constexpr` と `const` の主な違いは何ですか？',
    options: ['`constexpr` は変数にのみ使用でき、`const` は関数にも使用できる', '`const` は実行時に値が決定されるが、`constexpr` はコンパイル時に値が決定される必要がある', '`constexpr` はポインタの値を変更できないが、`const` はできる', '違いはない、`constexpr` は `const` の別名である'],
    correctAnswerIndex: 1,
    explanation: '`const` は変数が初期化後に変更されないことを意味します（実行時定数）。一方、`constexpr` はその値がコンパイル時に評価可能であることを示します（コンパイル時定数）。これにより、配列のサイズ指定や非型テンプレート引数など、コンパイル時定数が必要な場面で使用できます。'
  },
  {
    id: 42,
    level: QuestionLevel.Advanced,
    text: 'テンプレート引数の値や型を推論させつつ、その引数が左辺値か右辺値かの情報を保持するテンプレートパラメータの形式はどれですか？',
    options: ['`T&&`', '`const T&`', '`T*`', '`auto`'],
    correctAnswerIndex: 0,
    explanation: '`T&&` は転送参照（またはユニバーサル参照）と呼ばれ、テンプレートの型推論と組み合わせることで、引数が左辺値か右辺値かを保持します。これは完全転送（Perfect Forwarding）を実現するために不可欠です。'
  },
  {
    id: 43,
    level: QuestionLevel.Advanced,
    text: '`std::async` を使って非同期タスクを実行し、その結果を後で受け取るために使用するクラスはどれですか？',
    options: ['`std::promise`', '`std::thread`', '`std::packaged_task`', '`std::future`'],
    correctAnswerIndex: 3,
    explanation: '`std::async` は `std::future` オブジェクトを返します。この `future` を通じて、非同期に実行されているタスクの完了を待ち、その結果（戻り値や例外）を取得することができます。'
  },
  {
    id: 44,
    level: QuestionLevel.Advanced,
    text: 'スレッドセーフな方法で変数の読み書きを行うための、C++11の標準ライブラリコンポーネントはどれですか？',
    options: ['`volatile`', '`std::mutex`', '`std::atomic`', '`thread_local`'],
    correctAnswerIndex: 2,
    explanation: '`std::atomic` は、アトミックな（不可分な）操作を保証する型を提供します。これにより、単純なインクリメントや代入などの操作で `std::mutex` を使ったロックが不要になり、パフォーマンスが向上する場合があります。'
  },
  {
    id: 45,
    level: QuestionLevel.Advanced,
    text: 'CRTP (Curiously Recurring Template Pattern) は、どのような目的で一般的に使用されますか？',
    options: ['実行時ポリモーフィズムを実現するため', 'コンパイル時ポリモーフィズム（静的ポリモーフィズム）を実現するため', 'メモリ使用量を削減するため', '複数スレッド間の同期を取るため'],
    correctAnswerIndex: 1,
    explanation: 'CRTPは、基底クラスが派生クラスをテンプレート引数として受け取るデザインパターンです。これにより、仮想関数を使わずに静的な（コンパイル時の）多態性を実現でき、パフォーマンス上のオーバーヘッドを回避できます。'
  },
  {
    id: 46,
    level: QuestionLevel.Advanced,
    text: 'RAII原則と例外安全性を組み合わせる上で、最も重要な考え方はどれですか？',
    options: ['全ての関数で `noexcept` を指定する', 'リソース管理をオブジェクトのライフタイムに結びつける', '例外が発生したら即座に `std::terminate` を呼び出す', '`try-catch` ブロックをネストさせる'],
    correctAnswerIndex: 1,
    explanation: 'RAIIは、リソースの確保をオブジェクトの初期化時に、解放をデストラクタで行う原則です。関数内で例外がスローされても、スタック上のオブジェクトのデストラクタは自動的に呼び出されるため、リソースリークを防ぎ、例外安全なコードを記述する上で非常に重要です。'
  },
  {
    id: 47,
    level: QuestionLevel.Advanced,
    text: 'アルゴリズムのファミリーを定義し、それぞれをカプセル化して、動的に交換可能にするデザインパターンはどれですか？',
    options: ['Strategy パターン', 'Factory パターン', 'Singleton パターン', 'Adapter パターン'],
    correctAnswerIndex: 0,
    explanation: 'Strategy パターンは、異なるアルゴリズムを個別のクラスとして実装し、クライアントが実行時に使用するアルゴリズムを選択できるようにするものです。これにより、アルゴリズムの追加や変更が容易になります。'
  },
  {
    id: 48,
    level: QuestionLevel.Advanced,
    text: 'C++20のRangesライブラリがもたらす主な利点は何ですか？',
    options: ['コンパイル時間の劇的な短縮', '`begin` と `end` のペアの代わりに単一の範囲オブジェクトを扱えること', '実行可能ファイルのサイズ削減', '全てのSTLコンテナを置き換えること'],
    correctAnswerIndex: 1,
    explanation: 'Rangesライブラリは、イテレータのペア (`begin`, `end`) を抽象化し、単一の「範囲」オブジェクトとして扱えるようにします。これにより、パイプライン演算子 `|` を使ってアルゴリズムを連結でき、コードの可読性と構成可能性が大幅に向上します。'
  },
  {
    id: 50,
    level: QuestionLevel.Advanced,
    text: 'C++20で導入されたコルーチン (`co_await`, `co_yield`, `co_return`) の主な目的は何ですか？',
    options: ['非同期処理やジェネレータを、同期処理のような見た目で記述できるようにするため', 'コンパイル時間を短縮するための新しいメカニズム', '例外処理をより効率的に行うため', 'スレッド間の通信を型安全に行うため'],
    correctAnswerIndex: 0,
    explanation: 'コルーチンは、関数の実行を中断・再開できる仕組みを提供します。これにより、コールバックや `std::future` の連鎖を必要とした複雑な非同期コードを、あたかも直線的に実行されるかのように簡潔に記述することができます。'
  },
];
