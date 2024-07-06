require 'csv'

# CSVファイルのパスを指定
csv_file_path = 'musics.csv'

# CSVファイルを読み込み、各行に対して処理を行う
puts "musics = ["
CSV.foreach(csv_file_path, headers: true) do |row|
  puts %Q{  ["#{row["id"]}", "#{row["title"]}", "#{row["title_yomi"]}", "#{row["artist_name"].to_s.gsub(/"/, "\\\"")}", "#{row["artist_yomi"]}", "#{row["version"]}"],}
end
puts "]"
